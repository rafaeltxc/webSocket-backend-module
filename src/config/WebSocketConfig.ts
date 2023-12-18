import {
  type Data,
  type ClientOptions,
  WebSocket,
  type WebSocketServer
} from "ws";

export default class WebSocketConfig {
  /** Properties */
  private readonly WebSocket: WebSocketServer | null;

  /**
   * Class constructor
   */
  constructor(ws: WebSocketServer) {
    this.WebSocket = ws;
  }

  public config(): void {
    /* this.WebSocket?.on("error", (ws: WebSocket) => {
      ws.close();
    }); */

    this.WebSocket?.on(
      "connection",
      (ws: WebSocket, request: Request, client: ClientOptions) => {
        ws.on("error", () => {
          ws.close();
        });

        ws.on("message", (ws: WebSocket, data: Data, isBinary: boolean) => {
          this.WebSocket?.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(data, { binary: isBinary });
            }
          });
        });
      }
    );

    // this.WebSocket?.on(
    //   "message",
    //   (ws: WebSocket, data: Data, isBinary: boolean) => {
    //     this.WebSocket?.clients.forEach((client) => {
    //       if (client !== ws && client.readyState === WebSocket.OPEN) {
    //         client.send(data, { binary: isBinary });
    //       }
    //     });
    //   }
    // );
  }
}
