import { type Schema } from "mongoose";
import { type WebSocket } from "ws";

/**
 * User main interface.
 *
 * @interface
 */
interface UserObj {
  id?: Schema.Types.ObjectId
  username: string
  password: string
  email: string
  contacts?: Schema.Types.ObjectId[] | []
  picture?: Schema.Types.Buffer | null
  token?: string | null
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Chat main interface.
 *
 * @interface
 */
interface ChatObj {
  id?: Schema.Types.ObjectId
  participants: Schema.Types.ObjectId[]
  room: Schema.Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Room main interface
 *
 * @interface
 */
interface RoomObj {
  id?: Schema.Types.ObjectId
  clients: WebSocket[] | []
  messages: MessageObj[] | []
}

/**
 * Message main interface.
 *
 * @interface
 */
interface MessageObj {
  id?: Schema.Types.ObjectId
  datetime?: Date
  sender: Schema.Types.ObjectId
  message: string
}

/**
 * Token interface
 *
 * @interface
 */
interface TokenObj {
  token: string
}

/**
 * Error output interface
 *
 * @interface
 */
interface ErrorOutput {
  Ambient: string
  Type: string
  Message: string
  Error: string
}

interface WebSocketData {
  roomId: string
  message: string
  meta: string
}
