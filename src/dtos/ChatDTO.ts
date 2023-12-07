import { Schema } from "mongoose";
import {
  type MessageObj,
  type ChatObj,
  type ConversationObj,
} from "../types/Ambient";

/**
 * Chat DTO class.
 *
 * @class
 */
export default class ChatDTO implements ChatObj {
  public id: Schema.Types.ObjectId;
  public participants: Schema.Types.ObjectId[];
  public conversation: ConversationObj | [];

  /**
   * Class constructor.
   *
   * @constructor
   */
  private constructor() {
    this.id = new Schema.Types.ObjectId("");
    this.participants = [];
    this.conversation = [];
  }

  /**
   * Class builder to handle chat initiazlization.
   *
   * @returns {ChatDTO} New DTO.
   */
  public static builder(): ChatDTO {
    return new ChatDTO();
  }

  /**
   * Set chat id.
   *
   * @param {ObjectId} id - Chat id.
   * @returns {ChatDTO}
   */
  public setId(id: Schema.Types.ObjectId): ChatDTO {
    this.id = id;
    return this;
  }

  /**
   * Set chat participants.
   *
   * @param {ObjectId} participants - Users to be included.
   * @returns {ChatDTO}
   */
  public setParticipants(participants: Schema.Types.ObjectId[]): ChatDTO {
    this.participants = participants;
    return this;
  }

  /**
   * Set chat conversations.
   *
   * @param {ConversationObj | []} conversation - Messages to be added.
   * @returns {ChatDTO}
   */
  public setConversation(conversation: ConversationObj | []): ChatDTO {
    this.conversation = conversation;
    return this;
  }

  /**
   * Build object if all of the properties are valid.
   *
   * @returns {ChatObj} ChatObj with necessary start data.
   */
  public build(): ChatObj {
    if (
      Object.values(this).every((value) => {
        if (value === this.participants && this.participants.length < 2) {
          return null;
        }
        return value;
      })
    ) {
      const result: ChatObj = {} as ChatObj;
      for (const [key, value] of Object.entries(this)) {
        result[key as keyof ChatObj] = value;
      }
      return result;
    } else {
      throw new Error("DTO should not be empty");
    }
  }
}
