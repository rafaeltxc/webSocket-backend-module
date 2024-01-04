import { Schema, model } from "mongoose";
import { type RoomObj } from "../types/Ambient";

/**
 * Mongoose schema for room document.
 */
const RoomSchema = new Schema<RoomObj>({
  room: {
    type: String,
    required: true
  },
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

/**
 * Mongoose model for room document.
 */
export default model<RoomObj>("Room", RoomSchema);
