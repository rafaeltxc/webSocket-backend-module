/**
 * Helper class with methods to be used throughout the whole application.
 *
 * @class
 */
export default class Helper {
  /**
   * Concat all strings passed as arguments with no space in between.
   *
   * @param {string[]} args - List of N number os strings.
   */
  public concatWithNoSpace(...args: string[]): string {
    return args.join("");
  }

  /**
   * Concat all strings passed as arguments with spaces between each one.
   *
   * @param {string[]} args - List of N number os strings.
   */
  public concatWithSpaces(...args: string[]): string {
    return args.join(" ");
  }

  /**
   * Remove all whitespaces inside and outside of the string.
   *
   * @param {string} str - String to be trimed.
   */
  public trimExtraWhitespaces(str: string): string {
    return str.trim().replace(/\s+/g, " ");
  }

  /**
   * Extract token from string.
   *
   * @param {string} token - Full token string with it's type.
   */
  public formatToken(token: string) {
    const formatedToken: string = token.split(" ")[1];
    return formatedToken;
  }

  /**
   * Compare decoded jwt date and check if the time is expired.
   *
   * @para {number} receivedDate - Date in hours to be compared.
   */
  public checkExpiredTime(receivedDate: number): boolean {
    const today: number = Math.floor(Date.now() / 1000);

    if (today >= receivedDate) {
      return false;
    }
    return true;
  }
}
