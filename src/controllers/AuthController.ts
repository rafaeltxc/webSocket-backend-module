import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import AuthorizationService from "../services/AuthorizationService";
import Helper from "../utils/Helper";
import TokenDTO from "../dtos/TokenDTO";
import { type TokenObj } from "../types/Ambient";

/** Properties */
const key: string | undefined = process.env.AUTHORIZATION_KEY;

/** Dependencies */
const authorizationService: AuthorizationService = new AuthorizationService();
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
    next: NextFunction
  ): Promise<void> {
    const id: string | undefined = request.params.id;

    try {
      if (id) {
        const validation: boolean =
          await authorizationService.userValidation(id);
        if (!validation) {
          throw new Error("User token not recongnized");
        }

        const signed = jwt.sign({ id }, key!, {
          algorithm: "HS256",
          expiresIn: "1h"
        });

        const newToken: string = helper.concatWithSpaces("Bearer", signed);

        const token: TokenObj = TokenDTO.builder().setToken(newToken).build();

        response.status(200).json(token);
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
  public async login(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const password: string | undefined = request.body.password;

    try {
      if (id && password) {
        const newToken = jwt.sign({ id }, key!, {
          algorithm: "HS256"
        });

        await authorizationService.updateToken(id, newToken, password);

        const token: string = helper.concatWithSpaces("Bearer", newToken);
        const tokenDTO: TokenObj = TokenDTO.builder().setToken(token).build();

        response.status(200).json(tokenDTO);
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      next(error);
    }
  }
}
