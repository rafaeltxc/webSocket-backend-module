import ConversationController from "../controllers/ConversationController";
import { Router } from "express";

export default class ConversationRoutes {
  /** Properties */
  public router: Router = Router();

  /** Dependencies */
  private readonly controller: ConversationController = new ConversationController();

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
