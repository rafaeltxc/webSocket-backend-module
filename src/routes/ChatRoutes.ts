import ChatController from "../controllers/ChatController";
import { Router } from "express";

/**
 * Routes class for ChatController.
 *
 * @class
 */
export default class ChatRoutes {
  /** Properties */
  public router: Router = Router();

  /** Dependencies */
  private readonly controller: ChatController = new ChatController();

  /**
   * Class constructor.
   *
   * @constructor
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Set all the chat routes.
   */
  private initializeRoutes(): void {
    this.router.get("/", this.controller.findAll);
    this.router.get("/:id", this.controller.findById);
    this.router.post("/:id", this.controller.createOne);
    this.router.put("/:userId/:chatId", this.controller.updateOne);
    this.router.delete("/:userId/:chatId", this.controller.deleteOne);
    this.router.put("/add-message/:userId/:chatId", this.controller.addMessage);
  }
}
