import RoomController from "../controllers/RoomController";
import { Router } from "express";

export default class RoomRoutes {
  /** Properties */
  public router: Router = Router();

  /** Dependencies */
  private readonly controller: RoomController = new RoomController();

  /**
   * class constructor.
   *
   * @constructor
   */
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.findAll);
    this.router.get("/:id", this.controller.findById);
    this.router.post("/", this.controller.createOne);
    this.router.put("/:id", this.controller.updateOne);
    this.router.delete("/:id", this.controller.updateOne);
  }
}
