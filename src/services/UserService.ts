import Encipher from "../encryptation/Encipher";
import { UserObj } from "../types/Ambient";
import model from "../models/UserModel";

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
   * Check if user password is the same as the one stored in the database.
   *
   * @async
   * @param {string} id - User id.
   * @param {string} newPass - Hashed string password to be compared.
   * @returns {string} New password as a hash, if validation is ok.
   */
  public async equalPasswords(id: string, newPass: string): Promise<string> {
    const pass: string = await this.encipher.decrypt(newPass);

    const user: UserObj | null = await model.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const isEqual: boolean = await this.encipher.validateData(
      pass,
      user.password,
    );
    if (isEqual) {
      throw new Error("Equal passwords");
    }

    return await this.encipher.encrypt(newPass);
  }
}
