import ws from "ws";

export default class WebSocket {
  /** Properties */
  private WebSocket: ws | null;

  /**
   * Class constructor
   */
  constructor(ws: ws) {
    this.WebSocket = ws;
  }

  public config(): void {
    this.WebSocket?.on("open", (ws: ws) => {});
    this.WebSocket?.on("close", (ws: ws) => {});
    this.WebSocket?.on("message", (ws: ws) => {});
  }
}
