import { Schema } from "mongoose";
import type { ConversationObj, MessageObj } from "../types/Ambient";
import { type WebSocket } from "ws";

export default class ConversationDTO implements ConversationObj {
  public id: Schema.Types.ObjectId;
  public ws: WebSocket | null;
  public messages: MessageObj[] | [];

  private constructor() {
    this.id = new Schema.Types.ObjectId("");
    this.ws = null;
    this.messages = [];
  }

  public static builder(): ConversationDTO {
    return new ConversationDTO();
  }

  public setId(id: Schema.Types.ObjectId): ConversationDTO {
    this.id = id;
    return this;
  }

  public setWs(ws: WebSocket): ConversationDTO {
    this.ws = ws;
    return this;
  }

  public setMessages(messages: MessageObj[] | []): ConversationDTO {
    this.messages = messages;
    return this;
  }

  public build(): ConversationObj {
    if (Object.values(this).every((value) => value)) {
      const result: ConversationObj = {} as ConversationObj;
      for (const [key, value] of Object.entries(this)) {
        result[key as keyof ConversationObj] = value;
      }
      return result;
    } else {
      throw new Error("DTO should not be empty");
    }
  }
}
