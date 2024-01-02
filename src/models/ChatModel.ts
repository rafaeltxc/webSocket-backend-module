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
      type: Schema.Types.ObjectId,
      ref: "Conversation"
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
