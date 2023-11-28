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
  private controller: AuthController = new AuthController();

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
  private initializeRoutes() {
    this.router.post("/sign/access-token/:id", this.controller.accessToken);
    this.router.post("/sign/user-token/:id", this.controller.userToken);
    this.router.post("/access/verify/:id", this.controller.validateAccessToken);
  }
}
