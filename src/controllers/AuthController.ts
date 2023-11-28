import { type NextFunction, type Request, type Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import AuthorizationService from "../services/AuthorizationService";
import UserService from "../services/UserService";
import Helper from "../utils/Helper";

/** Properties */
const key: string = process.env.AUTHORIZATION_KEY!;

/** Dependencies */
const authorizationService: AuthorizationService = new AuthorizationService();
const userService: UserService = new UserService();
const helper: Helper = new Helper();

/**
 * Authotization controller class.
 *
 * @class
 */
export default class AuthController {
  /**
   * Generate new access token.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async accessToken(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const id: string | undefined = request.params.id;

    try {
      if (id) {
        const validation: boolean =
          await authorizationService.userValidation(id);
        if (!validation) {
          throw new Error("User token not recongnized");
        }

        const signed = jwt.sign({ id }, key, {
          algorithm: "HS256",
          expiresIn: "10m",
        });

        const newToken: string = helper.concatWithSpaces("Bearer", signed);
        response.status(200).json(newToken);
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate new user token and persists it.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async userToken(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const password: string | undefined = request.body.password;

    try {
      if (id && password) {
        const newToken = jwt.sign({ id }, key, {
          algorithm: "HS256",
          expiresIn: "7d",
        });

        await userService.updateToken(id, newToken, password);
        const accessToken: string = await authorizationService.accessToken(id);

        response.status(200).json(accessToken);
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Validate access token.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async validateAccessToken(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const receivedToken: string | undefined = request.header("Authorization");

    try {
      if (id && receivedToken) {
        const token: string = helper.formatToken(receivedToken);
        const decoded: JwtPayload | null = jwt.decode(token, {
          complete: true,
          json: true,
        });

        const tokenId: string | undefined = decoded?.payload?.id;
        if (id !== tokenId) {
          throw new Error("Invalid token");
        }

        const tokenExp: string | undefined = decoded?.payload?.exp;
        const validateDate: boolean = helper.checkExpiredTime(
          parseInt(tokenExp!),
        );
        if (!validateDate) {
          const userAuth: boolean =
            await authorizationService.userValidation(id);
          if (!userAuth) {
            throw new Error("Invalid user token");
          }

          const newToken: string = await authorizationService.accessToken(id);
          response.status(200).json(newToken);
          return;
        }

        const validated: string | JwtPayload = jwt.verify(token, key, {
          maxAge: "10m",
        });
        if (!validated) {
          throw new Error("Invalid access token");
        }
        response.status(204).end();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      next(error);
    }
  }
}
