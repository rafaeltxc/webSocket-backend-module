import {
  type ClientOptions,
  WebSocket,
  type WebSocketServer,
  type RawData
} from "ws";

export default class WebSocketConfig {
  /** Properties */
  private readonly WebSocket: WebSocketServer | null;
  public conn: WebSocket | null;

  /**
   * Class constructor
   */
  constructor(ws: WebSocketServer) {
    this.WebSocket = ws;
    this.conn = null;
  }

  public config(): void {
    this.WebSocket?.on(
      "connection",
      (ws: WebSocket, request: Request, client: ClientOptions) => {
        ws.on("error", () => {
          ws.close();
        });

        this.conn = ws;

        ws.on("message", (data: RawData, isBinary: boolean) => {
          this.WebSocket?.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(data, { binary: isBinary });
            }
          });
        });
      }
    );
  }
}
