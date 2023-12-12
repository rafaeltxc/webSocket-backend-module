import { type NextFunction, type Request, type Response } from "express";
import { type UserObj } from "../types/Ambient";
import Model from "../models/UserModel";
import Database from "../config/Database";
import Encipher from "../encryptation/Encipher";
import Helper from "../utils/Helper";
import AuthorizationService from "../services/AuthorizationService";
import UserService from "../services/UserService";
import UserDTO from "../dtos/UserDTO";

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
    next: NextFunction
  ): Promise<void> {
    try {
      const result: UserObj[] = await Model.find();

      const usersList: UserObj[] = [];
      result.forEach((user) => {
        usersList.push(
          UserDTO.builder()
            .setId(user.id!)
            .setUsername(user.username)
            .setPassword(user.password)
            .setEmail(user.email)
            .build()
        );
      });

      response.status(200).json(usersList);
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
    next: NextFunction
  ): Promise<void> {
    const id: string | undefined = request.params.id;

    try {
      if (id) {
        const result: UserObj | null = await Model.findById(id);
        if (!result) {
          throw new Error("User not found");
        }

        const user: UserObj = UserDTO.builder()
          .setId(result.id!)
          .setUsername(result.username)
          .setPassword(result.password)
          .setEmail(result.email)
          .build();

        response.status(200).json(user);
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
    next: NextFunction
  ): Promise<void> {
    const email: string | undefined = request.params.email;
    try {
      const result: UserObj | null = await Model.findOne({ email });
      if (!result) {
        throw new Error("User not found");
      }

      const user: UserObj = UserDTO.builder()
        .setId(result.id!)
        .setUsername(result.username)
        .setPassword(result.password)
        .setEmail(result.email)
        .build();

      response.status(200).json(user);
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
    next: NextFunction
  ): Promise<void> {
    const body: UserObj = request.body;

    try {
      if (body) {
        await database.createTransaction();
        const user = new Model({
          ...body,

          name: helper.trimExtraWhitespaces(body.username),
          password: await encipher.encrypt(body.password)
        });
        const result: UserObj = await user.save();

        const userDTO: UserObj = UserDTO.builder()
          .setId(result.id!)
          .setUsername(result.username)
          .setPassword(result.password)
          .setEmail(result.email)
          .build();

        await database.commitTransaction();
        response.status(201).json(userDTO);
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      await database.abortTransaction();
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
    next: NextFunction
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const body: UserObj | undefined = request.body;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (id && body && auth) {
        const tokenValidation = await authService.validateToken(id, auth);
        if (!tokenValidation) {
          throw new Error("Invalid token");
        }

        await database.createTransaction();
        await Model.findByIdAndUpdate(id, body);

        await database.commitTransaction();
        response.status(204).end();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      await database.abortTransaction();
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
    next: NextFunction
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const newPass: string | undefined = request.body.password;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (id && newPass && auth) {
        const tokenValidation = await authService.validateToken(id, auth);
        if (!tokenValidation) {
          throw new Error("Invalid token");
        }

        const hashedPassword = await userService.equalPasswords(id, newPass);

        await database.createTransaction();
        await Model.findByIdAndUpdate(id, { password: hashedPassword });

        await database.commitTransaction();
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
    next: NextFunction
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (id && auth) {
        const tokenValidation = await authService.validateToken(id, auth);
        if (!tokenValidation) {
          throw new Error("Invalid token");
        }

        await database.createTransaction();
        await Model.findByIdAndDelete(id);

        await database.commitTransaction();
        response.status(204).end();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      await database.abortTransaction();
      next(error);
    }
  }
}
