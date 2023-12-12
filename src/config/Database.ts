import {
  connect,
  startSession,
  set,
  type Mongoose,
  type ClientSession
} from "mongoose";

/**
 * Database Class for database configuration.
 *
 * @class
 */
export default class Database {
  /** Properties */
  private readonly URL: string | undefined = process.env.URL;
  private readonly MONGO_NAME: string | undefined = process.env.MONGO_NAME;
  private readonly MONGO_USER: string | undefined = process.env.MONGO_USER;
  private readonly MONGO_PASS: string | undefined = process.env.MONGO_PASS;
  private session: ClientSession | null;

  /**
   * Class constructor to initialize database.
   *
   * @constructor
   */
  constructor() {
    this.session = null;
    this.options();
  }

  /**
   * Set database configuration.
   */
  private options(): void {
    set("toJSON", {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    });
  }

  /**
   * Connect to the mongo database.
   *
   * @returns New server connection.
   */
  public async connect(): Promise<Mongoose> {
    return await connect(`${this.URL}`, {
      dbName: this.MONGO_NAME,
      user: this.MONGO_USER,
      pass: this.MONGO_PASS,
      serverSelectionTimeoutMS: 10000
    });
  }

  /**
   * Create a new Mongoose Session and open a transaction.
   *
   * @async
   */
  public async createTransaction(): Promise<void> {
    this.session = await startSession();
    this.session.startTransaction();
  }

  /**
   * Commit the transaction and close the session.
   *
   * @async
   */
  public async commitTransaction(): Promise<void> {
    await this.session?.commitTransaction();
    return await this.session?.endSession();
  }

  /**
   * Abort the transaction and close the session.
   *
   * @async
   */
  public async abortTransaction(): Promise<void> {
    await this.session?.abortTransaction();
    return await this.session?.endSession();
  }
}
