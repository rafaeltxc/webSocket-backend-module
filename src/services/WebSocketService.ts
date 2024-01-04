import Model from "../models/RoomModel";
import { type WebSocket } from "ws";

export default class WebSocketService {
  public async addClient(id: string, ws: WebSocket): Promise<void> {
    await Model.updateOne({ _id: id }, { $addToSet: { clients: ws } });
  }

  public async removeClient(id: string, ws: WebSocket): Promise<void> {
    await Model.deleteOne({ _id: id }, { $pull: { clients: ws } });
  }
}
