import { logger } from '@nx/devkit';
import chalk from 'chalk';
import { createProject, getSourceFile, NgMorphTree, saveActiveProject, setActiveProject } from 'ng-morph';
import { releaseChangelog, releaseVersion } from 'nx/release';
import { ChangelogOptions, NxReleaseArgs, VersionOptions } from 'nx/src/command-line/release/command-object';
import { commitChanges, VersionData } from 'nx/src/command-line/release/utils/shared';
import * as yargs from 'yargs';

type Project = 'core';

const projectMap: Record<
  Project,
  {
    packageName: string;
    versionFilePath: string;
  }
> = {
  core: {
    packageName: '@ts-fluentvalidation/core',
    versionFilePath: 'libs/core/src/lib/version.ts'
  }
};

(async () => {
  const options = await yargs
    .version(false) // don't use the default meaning of version in yargs
    .option('version', {
      description: 'Explicit version specifier to use, if overriding conventional commits',
      type: 'string'
    })
    .option('dryRun', {
      alias: 'd',
      description: 'Whether or not to perform a dry-run of the release process, defaults to false',
      type: 'boolean',
      default: false
    })
    .option('firstRelease', {
      description: 'Whether or not it is the first release, defaults to false',
      type: 'boolean',
      default: false
    })
    .option('interactive', {
      alias: 'i',
      type: 'string',
      description:
        'Interactively modify changelog markdown contents in your code editor before applying the changes. You can set it to be interactive for all changelogs, or only the workspace level, or only the project level.',
      choices: ['all', 'workspace', 'projects']
    })
    .option('verbose', {
      description: 'Whether or not to enable verbose logging, defaults to false',
      type: 'boolean',
      default: false
    })
    .parseAsync();

  process.env.GIT_EDITOR = 'code --wait';

  const nxReleaseArgs: NxReleaseArgs = {
    dryRun: options.dryRun,
    verbose: options.verbose
  };

  const gitCommitAndTagOptions: Pick<VersionOptions, 'stageChanges' | 'gitCommit' | 'gitTag'> = {
    gitCommit: true,
    gitTag: false,
    stageChanges: true
  };

  logger.info('🛠️  Starting release process...\n\n');

  logger.info('#️⃣  Versioning...\n\n');

  const versionOptions: VersionOptions = {
    ...nxReleaseArgs,
    ...gitCommitAndTagOptions,
    specifier: options.version,
    firstRelease: options.firstRelease
  };

  const { workspaceVersion, projectsVersionData } = await releaseVersion({
    ...versionOptions
  });

  await updateVersionPlaceholders(projectsVersionData, nxReleaseArgs);

  logger.info('📋  Generating CHANGELOG...\n\n');

  const changelogOptions: ChangelogOptions = {
    ...nxReleaseArgs,
    ...gitCommitAndTagOptions,
    gitCommit: false,
    versionData: projectsVersionData,
    version: workspaceVersion,
    firstRelease: options.firstRelease,
    interactive: options.interactive
  };

  await releaseChangelog({
    ...changelogOptions
  });

  logger.info(`🔥  ${chalk.green('DONE')}`);

  process.exit();
})();

async function updateVersionPlaceholders(versionData: VersionData, options: Pick<NxReleaseArgs, 'dryRun' | 'verbose'>) {
  logger.info('#️⃣  Updating version placeholders...\n\n');

  for (const [project, { packageName, versionFilePath }] of Object.entries(projectMap)) {
    logger.info(`🔄  Updating version placeholder for ${packageName}...\n`);

    const packageNewVersion = versionData[packageName]?.newVersion;
    if (packageNewVersion) {
      const changedFile = updateVersionPlaceholder(versionFilePath, packageNewVersion, options.dryRun);
      if (changedFile) {
        logger.info(`Updated ${changedFile}\n`);

        logger.info(`✅  ${chalk.green(`Set VERSION of '${packageName}' to ${packageNewVersion}`)}\n\n`);

        await commitChanges({
          changedFiles: [changedFile],
          isDryRun: options.dryRun,
          isVerbose: options.verbose,
          gitCommitMessages: [`chore(${project}): update version placeholder`]
        });
      }
    }
  }
}

function updateVersionPlaceholder(versionFilePath: string, version: string, dryRun?: boolean): string {
  setActiveProject(createProject(new NgMorphTree(), '/', ['**/*.ts']));

  const sourceFile = getSourceFile(versionFilePath);

  if (!dryRun) {
    const versionDeclaration = sourceFile?.getVariableDeclaration('VERSION');
    versionDeclaration?.setInitializer(`new Version('${version}')`);

    saveActiveProject();
  }

  let sourceFilePath = sourceFile?.getFilePath() || '';

  // if sourceFilePath starts with /, remove it
  if (sourceFilePath.startsWith('/')) {
    sourceFilePath = sourceFilePath.slice(1);
  }

  return sourceFilePath;
}
