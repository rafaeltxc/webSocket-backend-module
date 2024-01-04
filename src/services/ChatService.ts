import type { RoomObj } from "../types/Ambient";
import type { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import RoomModel from "../models/RoomModel";

export default class ChatService {
  public async createRoom(): Promise<Schema.Types.ObjectId> {
    const room = new RoomModel({
      room: uuid(),
      messages: []
    });

    const result: RoomObj = await room.save();
    return result.id!;
  }
}
