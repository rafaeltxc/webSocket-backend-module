import { Schema } from "mongoose";
import { type UserObj } from "types/Ambient";

/**
 * User DTO class.
 *
 * @class
 */
export default class UserDTO implements UserObj {
  public id: Schema.Types.ObjectId;
  public username: string;
  public password: string;
  public email: string;

  /**
   * Class constructor.
   *
   * @constructor
   */
  private constructor() {
    this.id = new Schema.Types.ObjectId("");
    this.username = "";
    this.password = "";
    this.email = "";
  }

  /**
   * Class builder to handle chat initiazlization.
   *
   * @returns {UserDTO} New DTO.
   */
  public static builder(): UserDTO {
    return new UserDTO();
  }

  /**
   * Set user id.
   *
   * @param {ObjectId} id - User id.
   * @returns {UserDTO}
   */
  public setId(id: Schema.Types.ObjectId): UserDTO {
    this.id = id;
    return this;
  }

  /**
   * Set user username.
   *
   * @param {string} username - Given username.
   * @returns {UserDTO}
   */
  public setUsername(username: string): UserDTO {
    this.username = username;
    return this;
  }

  /**
   * Set user password.
   *
   * @param {string} password - User password.
   * @returns {UserDTO}
   */
  public setPassword(password: string): UserDTO {
    this.password = password;
    return this;
  }

  /**
   * Set user given email.
   *
   *@param {string} email - User email.
   * @returns {UserDTO}
   */
  public setEmail(email: string): UserDTO {
    this.email = email;
    return this;
  }

  /**
   * Build object if all of the properties are valid.
   *
   * @returns {UserObj} UserObj with necessary start data.
   */
  public build(): UserObj {
    if (Object.values(this).every((value) => value)) {
      const result: UserObj = {} as UserObj;
      for (const [key, value] of Object.entries(this)) {
        result[key as keyof UserObj] = value;
      }
      return result;
    } else {
      throw new Error("DTO should not be empty");
    }
  }
}
