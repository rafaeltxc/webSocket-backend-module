import { Schema } from "mongoose";
import type { RoomObj, MessageObj } from "../types/Ambient";

/**
 * Room DTO class.
 *
 * @class
 */
export default class RoomDTO implements RoomObj {
  public id: Schema.Types.ObjectId;
  public room: string;
  public messages: MessageObj[] | [];

  /**
   * Class constructor.
   *
   * @constructor
   */
  private constructor() {
    this.id = new Schema.Types.ObjectId("");
    this.room = "";
    this.messages = [];
  }

  /**
   * Class builder to handle room initialization.
   *
   * @returns {RoomDTO} New DTO.
   */
  public static builder(): RoomDTO {
    return new RoomDTO();
  }

  /**
   * Set room id.
   *
   * @param {ObjectId} id - Room id.
   * @returns {RoomDTO}
   */
  public setId(id: Schema.Types.ObjectId): RoomDTO {
    this.id = id;
    return this;
  }

  /**
   * Set room id.
   *
   * @param {string} room - Room id.
   * @returns {RoomDTO}
   */
  public setWs(room: string): RoomDTO {
    this.room = room;
    return this;
  }

  /**
   * Set room messages.
   *
   * @param {MessageObj[]} messages - Room messages.
   * @returns {RoomDTO}
   */
  public setMessages(messages: MessageObj[] | []): RoomDTO {
    this.messages = messages;
    return this;
  }

  /**
   * Build object if all of the properties are valid.
   *
   * @returns {RoomObj} RoomObj with necessary initial data.
   */
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
