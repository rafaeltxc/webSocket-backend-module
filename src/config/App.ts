import cors, { type CorsOptions } from "cors";
import express, { type Application } from "express";
import ChatRoutes from "../routes/ChatRoutes";
import UserRoute from "../routes/UserRoutes";
import AuthRoutes from "../routes/AuthRoutes";
import AppMiddlewares from "../middlewares/AppMiddlewares";
import RoomRoutes from "../routes/RoomRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../../swagger.json";

/**
 * App class for app configuration.
 *
 * @class
 */
export default class App {
  /** Properties */
  public readonly app: Application;
  private readonly version: string = "api/v1";

  /** Dependencies */
  private readonly user: UserRoute = new UserRoute();
  private readonly chat: ChatRoutes = new ChatRoutes();
  private readonly authorization: AuthRoutes = new AuthRoutes();
  private readonly room: RoomRoutes = new RoomRoutes();
  private readonly middlewares: AppMiddlewares = new AppMiddlewares();

  /**
   * Class constructor to initialize app.
   *
   * @constructor
   * @param {Application} app - App instantiation.
   */
  constructor(app: Application) {
    this.app = app;
    this.config(app);
    this.routes(app);
  }

  /**
   * Set app configurations before initialization.
   *
   * @param {Application} app - App instantiation.
   */
  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "*"
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Set app middlewares to communicate with the user.
   *
   * @param {Application} app - App instantiation.
   */
  private routes(app: Application): void {
    app.use(`/${this.version}/docs/swagger`, swaggerUi.serve, swaggerUi.setup(swaggerDoc));

    app.use(`/${this.version}/user`, this.user.router);
    app.use(`/${this.version}/chat`, this.chat.router);
    app.use(`/${this.version}/room`, this.room.router);
    app.use(`/${this.version}/auth`, this.authorization.router);

    app.use(this.middlewares.unknownEndpoint);
    app.use(this.middlewares.errorHandler);
  }
}
