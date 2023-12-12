import { Schema, model } from "mongoose";
import { type ChatObj } from "../types/Ambient";

/**
 * Mongoose schema for chat document.
 */
const ChatSchema = new Schema<ChatObj>(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true
    },
    conversation: {
      type: {
        chat: [
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
        ws: {
          type: String,
          required: true
        }
      },
      required: false,
      default: []
    }
  },
  {
    timestamps: true
  }
);

/**
 * Mongoose model for chat document.
 */
export default model<ChatObj>("Chat", ChatSchema);
