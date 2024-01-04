import { Schema, model } from "mongoose";
import { type RoomObj } from "../types/Ambient";

const RoomSchema = new Schema<RoomObj>({
  clients: [
    {
      type: Schema.Types.Mixed,
      required: false,
      default: []
    }
  ],
  messages: {
    type: [
      {
        id: {
          type: Schema.Types.ObjectId,
          auto: true
        },
        datetime: {
          type: Date,
          default: Date.now
        },
        sender: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        message: {
          type: String,
          required: true
        }
      }
    ],
    default: []
  }
});

export default model<RoomObj>("Room", RoomSchema);
