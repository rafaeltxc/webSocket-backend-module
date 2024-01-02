import type { ConversationObj } from "../types/Ambient";
import type { Schema } from "mongoose";
import ConvModel from "../models/ConversationModel";
import WebSocket from "../config/WebSocket";
import { v4 as uuid } from "uuid";

export default class ChatService {
  private readonly wsc: WebSocket;

  constructor() {
    this.wsc = new WebSocket();
  }

  public async createConversation(): Promise<Schema.Types.ObjectId> {
    const url: string = "ws://localhost:8080/" + uuid();
    this.wsc.createConnection(url);

    const conversation = new ConvModel({
      ws: this.wsc.getConnection(),
      messages: []
    });

    console.log(this.wsc.getConnection());

    const result: ConversationObj = await conversation.save();
    console.log(result);
    return result.id!;
  }
}
