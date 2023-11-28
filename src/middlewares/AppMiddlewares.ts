
import { type NextFunction, type Request, type Response } from "express";
import * as errors from "../types/Errors";

/**
 * Middlewares class with app handlers.
 *
 * @class
 */
export default class AppMiddlewares {
  /**
   * Gets the error name, and handles it accordling.
   *
   * @param error Error and it's properties.
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public errorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    switch (error.name) {
      case "MongooseError":
        response.status(503).json(errors.DBOperation(error.message));
        break;
      case "ValidationError":
        response.status(403).json(errors.MissingData(error.message));
        break;
      case "Missing request data":
        response.status(403).json(errors.MissingData(error.message));
        break;
      default:
        console.log(error.name);
        response.status(500).json(errors.Default(error.message));
        break;
    }
  }

  /**
   * Handles 404 request error.
   *
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public unknownEndpoint(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    try {
      response.status(404).json({
        Error: "Unknown endpoint",
      });
      next();
    } catch (error) {
      next(error);
    }
  }
}
