import "dotenv/config";
import crypto, { BinaryLike, type CipherKey } from "node:crypto";
import Helper from "../utils/Helper";
import _ from "lodash";

/**
 * Encipher class to handle encryption.
 *
 * @class
 */
export default class Encipher {
  /** Properties. */
  private algorithm: string;
  private key: BinaryLike | undefined;

  /** Dependencies. */
  private helper: Helper;

  /**
   * Class constructor.
   *
   * @constructor
   */
  constructor() {
    this.algorithm = "aes-192-cbc";
    this.key = Buffer.from(process.env.ENCRYPTION_KEY!, "utf8");
    this.helper = new Helper();
  }

  /**
   * Base to handle encryption logic.
   *
   * @async
   * @param {Function} operation - Function that will be used to complement the logic.
   * @param {Buffer} iv - Iv if needed.
   * @returns {string} Password after operation.
   */
  private encipherBase(operation: Function, iv?: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.scrypt(this.key!, "salt", 24, (error, key) => {
        if (error) reject(error);

        if (iv) {
          resolve(operation(key));
          return;
        }

        crypto.randomFill(new Uint8Array(16), (error, iv) => {
          if (error) reject(error);

          resolve(operation(key, iv));
        });
      });
    });
  }

  /**
   * Encrypt data.
   *
   * @async
   * @param {string} data - Given string to be encrypted.
   * returns {string} Encrypted password.
   */
  public async encrypt(data: string): Promise<string> {
    try {
      if (!data) {
        throw new Error("Undefined data");
      }

      return await this.encipherBase((key: CipherKey, iv: Buffer): string => {
        const hexIv: string = Buffer.from(iv as Buffer).toString("hex");
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);

        let encrypted = cipher.update(data, "utf8", "hex");
        return this.helper.concatWithNoSpace(
          hexIv,
          ":",
          encrypted,
          cipher.final("hex"),
        );
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Decrypt data.
   *
   * @async
   * @param {string} data - Given hash to be decrypted.
   * @returns {string} Decrypted password.
   */
  public async decrypt(data: string): Promise<string> {
    try {
      if (!data) {
        throw new Error("Undefined data");
      }

      const [hexIv, hash]: string[] = data.split(":");
      const iv: Buffer = Buffer.from(hexIv, "hex");

      return await this.encipherBase((key: CipherKey): string => {
        const decipher = crypto.createDecipheriv(this.algorithm, key, iv);

        let decrypted = decipher.update(hash, "hex", "utf8");
        return (decrypted += decipher.final("utf8"));
      }, iv);
    } catch (error) {
      throw error;
    }
  }

  /**
  * Compare data and check if they are equal.
  *
  * @async
  * @param {string} data - Raw data to be compared.
  * @param {string} savedData - Encrypted data to be decrypted and compared.
  * returns {boolean} Password is valid or not.
  */
  public async validateData(data: string, savedData: string): Promise<boolean> {
    const decrypted: string = await this.decrypt(savedData);

    if (_.isEqual(data, decrypted)) {
      return true;
    }

    return false;
  }
}
