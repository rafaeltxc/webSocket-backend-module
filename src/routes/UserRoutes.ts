import { Router } from "express";
import UserController from "../controllers/UserController";

/**
 * Routes class for UserController.
 *
 * @class
 */
export default class UserRoute {
  /** Properties */
  public router: Router = Router();

  /** Dependencies */
  private controller: UserController = new UserController();

  /**
   * class constructor.
   *
   * @constructor
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Set all the user routes.
   */
  private initializeRoutes(): void {
    this.router.get("/", this.controller.findAll);
    this.router.get("/:id", this.controller.findById);
    this.router.get("/email/:email", this.controller.findByEmail);
    this.router.post("/", this.controller.createOne);
    this.router.put("/:id", this.controller.updateOne);
    this.router.put("/token/:id", this.controller.updateToken);
    this.router.put("/password/:id", this.controller.updatePassword);
    this.router.delete("/:id", this.controller.deleteOne);
  }
}
