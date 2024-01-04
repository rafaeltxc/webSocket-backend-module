import { type WebSocketData } from "../types/Ambient";
import { type WebSocket, type WebSocketServer } from "ws";

interface test {
  roomId: string
  clients: WebSocket[]
}

export default class WebSocketConfig {
  /** Properties */
  private readonly WebSocket: WebSocketServer | null;

  private rooms: test[] = [];

  /**
   * Class constructor
   */
  constructor(ws: WebSocketServer) {
    this.WebSocket = ws;
  }

  public config(): void {
    this.WebSocket?.on("connection", (ws: WebSocket) => {
      ws.on("error", () => {
        ws.close();
      });

      ws.on("message", async (receivedData: WebSocketData, isBinary: boolean) => {
        const data = JSON.parse(receivedData.toString());
        const { roomId, meta, message } = data;

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

  private broadcast(id: string, message: string, ws: WebSocket): void {
    const room: test[] = this.rooms.filter(({ roomId }) => roomId === id);
    room[0].clients.forEach(client => {
      if (client !== ws) {
        client.send(message);
      }
    });
  }

  private async join(id: string, ws: WebSocket): Promise<void> {
    if (this.rooms.filter((room) => room.roomId === id).length === 0) {
      this.rooms.push({
        roomId: id,
        clients: [ws]
      });
    } else {
      const newRoomsList: test[] = this.rooms.map(room => {
        if (room.roomId === id) {
          const updatedRoom: test = { ...room };
          updatedRoom.clients.push(ws);
          return updatedRoom;
        }
        return room;
      });
      this.rooms = newRoomsList;
    }
  }

  private async leave(id: string, ws: WebSocket): Promise<void> { }
}
