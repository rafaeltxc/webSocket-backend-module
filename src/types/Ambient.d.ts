import { type Mongoose } from "mongoose";

/**
 * User main interface.
 *
 * @interface
 */
interface UserObj {
  id?: mongoose.Types.ObjectId;
  username: string;
  password: string;
  email: string;
  contacts?: Schema.Types.ObjectId[] | [];
  picture?: Schema.Types.Buffer | null;
  token?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Chat main interface.
 *
 * @interface
 */
interface ChatObj {
  id?: Schema.Types.ObjectId;
  participants: Schema.Types.ObjectId[];
  conversation: MessageObj[] | [];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Message main interface.
 *
 * @interface
 */
interface MessageObj {
  id?: Schema.Types.ObjectId;
  datetime: Date;
  sender: Schema.Types.ObjectId;
  message: string;
}

interface TokenObj {
  token: string;
}

/**
 * Error output interface
 *
 * @interface
 */
interface ErrorOutput {
  Ambient: string;
  Type: string;
  Message: string;
  Error: string;
}
