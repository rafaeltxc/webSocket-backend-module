import UserModel from "models/UserModel";
import Encipher from "../encryptation/Encipher";
import { UserObj } from "../types/Ambient";

/**
 * User service class
 *
 * @class
 */
export default class UserService {
  /** Dependencies */
  private encipher: Encipher;

  /**
   * Class constructor.
   *
   * @constructor
   */
  constructor() {
    this.encipher = new Encipher();
  }

  /**
   * Validate user password.
   *
   * @param {string} id - User id.
   * @param {string} password - Raw user password.
   * @returns {boolean} User password is valid or not.
   */
  public async validatePassword(
    id: string,
    password: string,
  ): Promise<boolean> {
    try {
      const response: Response = await fetch(
        `http://localhost:8080/user/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const user: UserObj = await response.json();

      const validation: boolean = await this.encipher.validateData(
        password,
        user.password,
      );
      if (validation) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user password is the same as the one stored in the database.
   *
   * @async
   * @param {string} id - User id.
   * @param {string} newPass - Hashed string password to be compared.
   * @returns {string} New password as a hash, if validation is ok.
   */
  public async equalPasswords(id: string, newPass: string): Promise<string> {
    try {
      const pass: string = await this.encipher.decrypt(newPass);

      const response: Response = await fetch(
        `http://localhost:8080/user/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const user: UserObj = await response.json();

      const isEqual: boolean = await this.encipher.validateData(
        pass,
        user.password,
      );
      if (isEqual) {
        throw new Error("Equal passwords");
      }

      return await this.encipher.encrypt(newPass);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user token in the database.
   *
   * @param {string} id - User id.
   * @param {string} token - Token to be stored.
   */
  public async updateToken(
    id: string,
    token: string,
    pass: string,
  ): Promise<void> {
    try {
      const response: Response = await fetch(
        `http://localhost:8080/user/token/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            password: pass,
          }),
        },
      );

      if (response.status !== 204) {
        throw new Error("Fetch error");
      }
    } catch (error) {
      throw error;
    }
  }
}
