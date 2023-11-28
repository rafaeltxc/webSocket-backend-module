import { ErrorOutput } from "./Ambient";

/**
 * Stores the types of ambients that errors can happen.
 *
 * @enum
 */
enum ErrorAmbient {
  INTERNAL = "Internal Error",
  EXTERNAL = "External Error",
}

/**
 * Stores the types of errors that can happen.
 *
 * @enum
 */
enum ErrorType {
  DEFAULT = "Default Message",
  DATABASE = "Database",
  USER = "User Operation",
}

/**
 * Default message for unhandled error.
 *
 * @param {string} error - Given error.
 */
export function Default(error: string): ErrorOutput {
  return {
    Ambient: ErrorAmbient.INTERNAL,
    Type: ErrorType.DEFAULT,
    Message: "Request could not be fulfilled due internal server error",
    Error: error,
  };
}

/**
 * Database failed connection error.
 *
 * @param {string} error - Given error.
 */
export function DBOperation(error: string): ErrorOutput {
  return {
    Ambient: ErrorAmbient.INTERNAL,
    Type: ErrorType.DATABASE,
    Message: "Operation could not be fulfilled due database problems",
    Error: error,
  };
}

/**
 * Missing data during request error.
 *
 * @param {string} error - Given error.
 */
export function MissingData(error: string): ErrorOutput {
  return {
    Ambient: ErrorAmbient.EXTERNAL,
    Type: ErrorType.USER,
    Message: "Missing request data, please fill all the fields",
    Error: error,
  };
}
