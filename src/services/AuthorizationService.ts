import { UserObj } from "../types/Ambient";
import jwt, { JwtPayload } from "jsonwebtoken";
import _ from "lodash";

/**
 * Authorization service class.
 *
 * @class
 */
export default class AuthorizationService {
  /** Properties */
  private key: string;

  /**
   * Class constructor
   *
   * @constructor
   */
  constructor() {
    this.key = process.env.AUTHORIZATION_KEY!;
  }

  /**
   * Check if access token is still valid.
   *
   * @async
   * @param {string} id - User id.
   * @param {string} token - Request given token.
   * @returns {Response} Http response with received request data.
   */
  public async validateAccessToken(
    id: string,
    token: string,
  ): Promise<Response> {
    try {
      return await fetch(`http://localhost:8080/auth/access/verify/${id}`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate saved user token.
   *
   * @async
   * @param {string} id - User id.
   * @returns {boolean} Saved token is valid or not.
   */
  public async userValidation(id: string): Promise<boolean> {
    try {
      const response: Response = await fetch(
        `http://localhost:8080/user/token/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data: UserObj = await response.json();
      
      const validated: string | JwtPayload = jwt.verify(data.token!, this.key, {
        maxAge: "7d",
      });

      if (validated) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generates new accessToken.
   *
   * @async
   * @param {string} id - User id.
   * @returns {string} Retrieved accessToken.
   */
  public async accessToken(id: string): Promise<string> {
    try {
      const response: Response = await fetch(
        `http://localhost:8080/auth/sign/access-token/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const token: string = await response.json();
      return token;
    } catch (error) {
      throw error;
    }
  }
}
