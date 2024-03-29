import { Schema } from "mongoose";
import { type ChatObj } from "../types/Ambient";

/**
 * Chat DTO class.
 *
 * @class
 */
export default class ChatDTO implements ChatObj {
  public id: Schema.Types.ObjectId;
  public participants: Schema.Types.ObjectId[];
  public room: Schema.Types.ObjectId;

  /**
   * Class constructor.
   *
   * @constructor
   */
  private constructor() {
    this.id = new Schema.Types.ObjectId("");
    this.participants = [];
    this.room = new Schema.Types.ObjectId("");
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
   * Set chat room.
   *
   * @param {RoomObj | []} room - Messages to be added.
   * @returns {ChatDTO}
   */
  public setRoom(room: Schema.Types.ObjectId): ChatDTO {
    this.room = room;
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
