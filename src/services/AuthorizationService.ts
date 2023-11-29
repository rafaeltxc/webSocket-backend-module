import { UserObj } from "../types/Ambient";
import jwt, { JwtPayload } from "jsonwebtoken";
import model from "../models/UserModel";
import _ from "lodash";
import Encipher from "../encryptation/Encipher";
import Helper from "../utils/Helper";

/**
 * Authorization service class.
 *
 * @class
 */
export default class AuthorizationService {
  /** Properties */
  private key: string;

  /** Dependencies */
  private encipher: Encipher;
  private helper: Helper;

  /**
   * Class constructor
   *
   * @constructor
   */
  constructor() {
    this.key = process.env.AUTHORIZATION_KEY!;
    this.encipher = new Encipher();
    this.helper = new Helper();
  }

  /**
   * Validate saved user token.
   *
   * @async
   * @param {string} id - User id.
   * @returns {boolean} Saved token is valid or not.
   */
  public async userValidation(id: string): Promise<boolean> {
    const user: UserObj | null = await model.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const validated: string | JwtPayload = jwt.verify(user.token!, this.key);
    if (validated) {
      return true;
    }
    return false;
  }

/**
   * Update user token in the database after password validation.
   *
   * @param {string} id - User id.
   * @param {string} token - Token to be stored.
   * @param {string} pass - User password.
   */
  public async updateToken(
    id: string,
    token: string,
    pass: string,
  ): Promise<void> {
    const user: UserObj | null = await model.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const validation: boolean = await this.encipher.validateData(
      pass,
      user.password,
    );
    if (!validation) {
      throw new Error("Wrong password");
    }

    await model.findByIdAndUpdate(id, { token });
  }

  /**
   * Validate access token.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async validateToken(id: string, receivedToken: string): Promise<boolean> {
    const token: string = this.helper.formatToken(receivedToken);

    const user: UserObj | null = await model.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const decoded: JwtPayload | null = jwt.decode(token, {
      complete: true,
      json: true,
    });

    const tokenId: string | undefined = decoded?.payload?.id;
    if (id !== tokenId) {
      throw new Error("Invalid user token");
    }

    const validated: string | JwtPayload = jwt.verify(token, this.key, {
      maxAge: "1h",
    });
    if (!validated) {
      return false;
    }
    return true;
  }
}
