import ws from "ws";

export default class WebSocket {
  /** Properties */
  private conn: ws.WebSocket | null;

  /**
   * Class constructor
   */
  constructor() {
    this.conn = null;
  }

  public createConnection(url: string): void {
    this.conn = new ws.WebSocket(url);
  }

  public getConnection(): ws.WebSocket | null {
    if (this.conn) return this.conn;
    return null;
  }
}
