import Database from "./Database";
import { type Server } from "node:http";

export default class ServerConfig {
  /** Properties */
  private readonly PORT: number | undefined;

  /** Dependencies */
  private readonly mongodb: Database;

  constructor() {
    this.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
    this.mongodb = new Database();
  }

  /*
   * Set server on listening configuration.
   */
  public config(server: Server): void {
    /**
     * Server on listening configuration.
     */
    server.on("listening", async(): void => {
      try {
        await this.mongodb.connect();
        console.log("Connection with the Database established");
      } catch (error) {
        console.error({
          Message: "Connection with the Database could not be established",
          Error: error
        });
      }
    });

    /**
     * Server on error configuration.
     */
    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        console.log("Server could no be loaded, adresses already in use");
      } else {
        console.error(error);
      }
    });
  }

  /**
   * Start Express server listening at specified port.
   */
  public listen(server: Server): Server {
    return server.listen(this.PORT, () => {
      console.log(`Server listening on port ${this.PORT}`);
    });
  }
}
