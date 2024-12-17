/**
 * Represents a version number.
 */
class Version {
  public readonly major: string;
  public readonly minor: string;
  public readonly patch: string;

  /**
   * Creates a new instance of the Version class.
   * @param fullVersion - The full version number in the format "major.minor.patch".
   */
  constructor(public readonly fullVersion: string) {
    const [major, minor, patch] = fullVersion.split('.');
    this.major = major;
    this.minor = minor;
    this.patch = patch;
  }
}

/**
 * Represents the current version of the library.
 */
export const VERSION = new Version('1.0.0-rc.3');
