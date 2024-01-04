import { Schema } from "mongoose";
import type { RoomObj, MessageObj } from "../types/Ambient";
import { type WebSocket } from "ws";

export default class RoomDTO implements RoomObj {
  public id: Schema.Types.ObjectId;
  public clients: WebSocket[] | [];
  public messages: MessageObj[] | [];

  private constructor() {
    this.id = new Schema.Types.ObjectId("");
    this.clients = [];
    this.messages = [];
  }

  public static builder(): RoomDTO {
    return new RoomDTO();
  }

  public setId(id: Schema.Types.ObjectId): RoomDTO {
    this.id = id;
    return this;
  }

  public setWs(clients: WebSocket[]): RoomDTO {
    this.clients = clients;
    return this;
  }

  public setMessages(messages: MessageObj[] | []): RoomDTO {
    this.messages = messages;
    return this;
  }

  public build(): RoomObj {
    if (Object.values(this).every((value) => value)) {
      const result: RoomObj = {} as RoomObj;
      for (const [key, value] of Object.entries(this)) {
        result[key as keyof RoomObj] = value;
      }
      return result;
    } else {
      throw new Error("DTO should not be empty");
    }
  }
}
