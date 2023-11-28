import { Schema, model } from "mongoose";
import { type UserObj } from "../types/Ambient";

/**
 * Mongoose schema for user document.
 */
const UserSchema: Schema<UserObj> = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },

        message: "Please fill a valid email",
      },
    },
    contacts: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    picture: {
      type: Buffer,
      required: false,
      default: null,
    },
    token: {
      type: String,
      required: false,
      default: null
    }
  },
  {
    timestamps: true,
  },
);

/**
   * Mongoose model for user document.
 */
export default model<UserObj>("User", UserSchema);
