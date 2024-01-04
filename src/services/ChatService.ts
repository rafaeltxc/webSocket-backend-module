import type { RoomObj } from "../types/Ambient";
import type { Schema } from "mongoose";
import RoomModel from "../models/RoomModel";

export default class ChatService {
  public async createRoom(): Promise<Schema.Types.ObjectId> {
    const room = new RoomModel({
      clients: [],
      messages: []
    });

    const result: RoomObj = await room.save();
    return result.id!;
  }
}
