import AuthController from "../controllers/AuthController";
import { Router } from "express";

/**
 * Authorization routes class for AuthController.
 *
 * @class
 */
export default class AuthRoutes {
  /** Properties */
  public router: Router = Router();

  /** Dependencies */
  private readonly controller: AuthController = new AuthController();

  /**
   * Class constructor.
   *
   * @constructor
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Set all the authorization routes.
   */
  private initializeRoutes(): void {
    this.router.post("/access-token/:id", this.controller.accessToken);
    this.router.post("/sign-in/:id", this.controller.login);
  }
}
