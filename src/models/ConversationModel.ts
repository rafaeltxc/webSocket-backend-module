import { Schema, model } from "mongoose";
import { type ConversationObj } from "../types/Ambient";

const ConversationSchema = new Schema<ConversationObj>({
  ws: {
    type: Object,
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

export default model<ConversationObj>("Conversation", ConversationSchema);
