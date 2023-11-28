import { TokenObj } from "types/Ambient";

export default class TokenDTO implements TokenObj {
  public token: string;

  private constructor() {
    this.token = "";
  }

  public static builder(): TokenDTO {
    return new TokenDTO();
  }

  public setToken(token: string): TokenDTO {
    this.token = token;
    return this;
  }

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
