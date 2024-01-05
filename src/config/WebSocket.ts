import { type WebSocketData } from "../types/Ambient";
import { type WebSocket, type WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import { connections } from "mongoose";

export default class WebSocketConfig {
  /** Properties */
  private readonly WebSocket: WebSocketServer | null;
  private readonly rooms: Map<string, Set<WebSocket>>;
  private readonly connections: Map<string, WebSocket>;

  /**
   * Class constructor
   *
   * @constructor
   */
  constructor(ws: WebSocketServer) {
    this.WebSocket = ws;
    this.rooms = new Map();
    this.connections = new Map();
  }

  /**
  * Configure WebSocket connection.
  */
  public config(): void {
    this.WebSocket?.on("connection", (ws: WebSocket) => {
      ws.on("error", () => {
        ws.close();
      });

      ws.on("message", async (data: WebSocketData) => {
        const { roomId, meta, message } = JSON.parse(data.toString());

        switch (meta) {
          case "message":
            this.broadcast(roomId, message, ws);
            break;
          case "join":
            await this.join(roomId, ws);
            break;
          case "leave":
            await this.leave(roomId, ws);
            break;
          default:
            ws.send("Missing operation");
            break;
        }
      });
    });
  }

  /**
  * WebSocket message broadcast logic
  */
  private broadcast(id: string, message: string, ws: WebSocket): void {
    const clients = this.rooms.get(id);
    clients!.forEach((client: WebSocket) => {
      if (client !== ws) {
        client.send(message);
      }
    });
  }

  /**
  * WebSocket room joining logic
  *
  * @async
  */
  private async join(id: string, ws: WebSocket): Promise<void> {
    const clients = this.rooms.get(id);

    if (!clients) {
      const room = new Set([ws]);
      this.rooms.set(id, room);
    } else {
      clients.add(ws);
    }

    this.connections.set(uuid(), ws);
  }

  /**
  * WebSocket room leaving logic
  *
  * @async
  */
  private async leave(id: string, ws: WebSocket): Promise<void> {
    const clients = this.rooms.get(id);

    if (clients) {
      clients.delete(ws);
      this.connections.delete(id);
      if (clients.size === 0) {
        clients.delete(ws);
      }

      ws.close();
    }
  }
}
