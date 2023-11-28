import { TokenObj } from "types/Ambient";

/**
 * Token DTO class.
 *
 * @class
 */
export default class TokenDTO implements TokenObj {
  public token: string;

  /**
   * Class constructor.
   *
   * @constructor
   */
  private constructor() {
    this.token = "";
  }

  /**
   * Class builder to handle chat initiazlization.
   *
   * @returns {TokenDTO} New DTO.
   */
  public static builder(): TokenDTO {
    return new TokenDTO();
  }

  /**
   * Set token.
   *
   * @param {string} token.
   * @returns {ChatDTO}
   */
  public setToken(token: string): TokenDTO {
    this.token = token;
    return this;
  }

  /**
   * Build object if all of the properties are valid.
   *
   * @returns {TokenObj} TokenObj with necessary start data.
   */
  public build(): TokenObj {
    if (Object.values(this).every((value) => value)) {
      const result: TokenObj = {} as TokenObj;
      for (const [key, value] of Object.entries(this)) {
        result[key as keyof TokenObj] = value;
      }
      return result;
    } else {
      throw new Error("DTO should not be empty");
    }
  }
}
