import { NgDocApi } from '@ng-doc/core';

const Api: NgDocApi = {
  title: 'API reference',
  scopes: [
    {
      name: '@ts-fluentvalidation/core',
      route: 'core',
      include: 'libs/core/src/index.ts'
    },
    {
      name: '@ts-fluentvalidation/core/testing',
      route: 'core-testing',
      include: 'libs/core/src/testing/index.ts'
    },
    {
      name: '@ts-fluentvalidation/angular',
      route: 'angular',
      include: 'libs/integrations/angular/src/index.ts'
    }
  ]
};

export default Api;
