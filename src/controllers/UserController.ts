import { type NextFunction, type Request, type Response } from "express";
import { type UserObj } from "../types/Ambient";
import model from "../models/UserModel";
import _ from "lodash";
import Database from "../config/Database";
import Encipher from "../encryptation/Encipher";
import Helper from "../utils/Helper";
import AuthorizationService from "../services/AuthorizationService";
import UserService from "../services/UserService";

/** Dependencies */
const database: Database = new Database();
const encipher: Encipher = new Encipher();
const userService: UserService = new UserService();
const authService: AuthorizationService = new AuthorizationService();
const helper: Helper = new Helper();

/**
 * User controller class.
 *
 * @class
 */
export default class UserController {
  /**
   * Return all users in the database.
   *
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async findAll(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result: UserObj[] = await model.find();
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Return matching user in the database by id.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async findById(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const id: string | undefined = request.params.id;

    try {
      if (id) {
        const result: UserObj | null = await model.findById(id);
        response.status(200).json(result);
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Return matching user in the database by email.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async findByEmail(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const email: string | undefined = request.params.email;
    try {
      const result: UserObj | null = await model.findOne({ email: email });
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new user in the database.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async createOne(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const body: UserObj = request.body;

    try {
      if (body) {
        database.createTransaction();
        const user = new model({
          ...body,

          name: helper.trimExtraWhitespaces(body.username),
          password: await encipher.encrypt(body.password),
        });
        const result: UserObj = await user.save();

        database.commitTransaction();
        response.status(201).json(result);
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      database.abortTransaction();
      next(error);
    }
  }

  /**
   * Update a user in the database.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async updateOne(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const body: UserObj | undefined = request.body;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (id && body && auth) {
        const validation: any = await authService.validateAccessToken(id, auth);

        if (validation.status !== 200 && validation.status !== 204) {
          throw new Error("Invalid token");
        } else if (validation.status === 200) {
          response.status(401).json(await validation.json());
          return;
        }

        database.createTransaction();
        await model.findByIdAndUpdate(id, body);

        database.commitTransaction();
        response.status(204).end();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      database.abortTransaction();
      next(error);
    }
  }

  /**
   * Update user pesisted token.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async updateToken(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const id: string | undefined = request.params.id;
    const body: UserObj | undefined = request.body;

    try {
      if (id && body) {
        const verify: boolean = await userService.validatePassword(
          id,
          body.password,
        );
        if (!verify) {
          throw new Error("Wrong password");
        }

        database.createTransaction();
        await model.findByIdAndUpdate(id, { token: body.token });

        database.commitTransaction();
        response.status(204).end();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update password from specified user.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async updatePassword(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const newPass: string | undefined = request.body.password;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (id && newPass && auth) {
        const validation: any = await authService.validateAccessToken(id, auth);

        if (validation.status !== 200 && validation.status !== 204) {
          throw new Error("Invalid token");
        } else if (validation.status === 200) {
          response.status(401).json(await validation.json());
          return;
        }

        const hashedPassword = await userService.equalPasswords(id, newPass);

        database.createTransaction();
        await model.findByIdAndUpdate(id, { password: hashedPassword });

        database.commitTransaction();
        response.status(204).end();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a user from the database.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async deleteOne(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (id && auth) {
        const validation: any = await authService.validateAccessToken(id, auth);

        if (validation.status !== 200 && validation.status !== 204) {
          throw new Error("Invalid token");
        } else if (validation.status === 200) {
          response.status(401).json(await validation.json());
          return;
        }

        database.createTransaction();
        await model.findByIdAndDelete(id);

        database.commitTransaction();
        response.status(204).end();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      database.abortTransaction;
      next(error);
    }
  }
}
