import { type NextFunction, type Request, type Response } from "express";
import { type ChatObj, type MessageObj } from "../types/Ambient";
import Model from "../models/ChatModel";
import Database from "../config/Database";
import AuthorizationService from "../services/AuthorizationService";
import ChatDTO from "../dtos/ChatDTO";
import ChatService from "../services/ChatService";

/** Dependencies */
const database = new Database();
const authService: AuthorizationService = new AuthorizationService();
const chatService: ChatService = new ChatService();

/**
 * Chat controller class.
 *
 * @class
 */
export default class ChatController {
  /**
   * Return all the chats in the database.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async findAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result: ChatObj[] = await Model.find();
      if (!result) {
        throw new Error("Chat no found");
      }

      // const chatList: ChatObj[] = [];
      // result.forEach((chat) => {
      //   chatList.push(
      //     ChatDTO.builder()
      //       .setId(chat.id!)
      //       .setParticipants({ ...chat.participants })
      //       .setConversation(chat.conversation)
      //       .build()
      //   );
      // });

      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Return matching chat in the database by id.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async findById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string | undefined = request.params.id;

    try {
      if (id) {
        const result: ChatObj | null = await Model.findById(id);
        if (!result) {
          throw new Error("Chat no found");
        }

        const chat: ChatObj = ChatDTO.builder()
          .setId(result.id!)
          .setParticipants({ ...result.participants })
          .setConversation(result.conversation)
          .build();

        response.status(200).json(chat);
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new chat in the database.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async createOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const body: ChatObj = request.body;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (id && body && auth) {
        const tokenValidation = await authService.validateToken(id, auth);
        if (!tokenValidation) {
          throw new Error("Invalid token");
        }

        await database.createTransaction();
        const chat = new Model(body);
        const result: ChatObj = await chat.save();

        const conversation = await chatService.createConversation();

        const chatDTO: ChatObj = ChatDTO.builder()
          .setId(result.id!)
          .setParticipants({ ...result.participants })
          .setConversation(conversation)
          .build();

        await database.commitTransaction();
        response.status(201).json(chatDTO);
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      await database.abortTransaction();
      next(error);
    }
  }

  /**
   * Update a chat in the database.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async updateOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const userId: string | undefined = request.params.userId;
    const chatId: string | undefined = request.params.chatId;
    const body: ChatObj | undefined = request.body;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (userId && chatId && body && auth) {
        const tokenValidation = await authService.validateToken(userId, auth);
        if (!tokenValidation) {
          throw new Error("Invalid token");
        }

        await database.createTransaction();
        await Model.findByIdAndUpdate(chatId, body);

        await database.commitTransaction();
        response.status(204).json();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      await database.abortTransaction();
      next(error);
    }
  }

  /**
   * Delete a chat from the database.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async deleteOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const userId: string | undefined = request.params.userId;
    const chatId: string | undefined = request.params.chatId;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (userId && chatId && auth) {
        const tokenValidation = await authService.validateToken(userId, auth);
        if (!tokenValidation) {
          throw new Error("Invalid token");
        }

        await database.createTransaction();
        await Model.findByIdAndDelete(chatId);

        await database.commitTransaction();
        response.status(204).end();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      await database.abortTransaction();
      next(error);
    }
  }

  /**
   * Update chat conversation with a new message.
   *
   * @async
   * @param request App request handler.
   * @param response App response handler.
   * @param next Express App function.
   */
  public async addMessage(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const userId: string | undefined = request.params.userId;
    const chatId: string | undefined = request.params.chatId;
    const body: MessageObj | undefined = request.body;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (userId && chatId && body && auth) {
        const tokenValidation = await authService.validateToken(userId, auth);
        if (!tokenValidation) {
          throw new Error("Invalid token");
        }

        await database.createTransaction();
        await Model.findByIdAndUpdate(chatId, {
          $push: { conversation: { sender: userId, message: body.message } }
        });

        await database.commitTransaction();
        response.status(204).end();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      await database.abortTransaction();
      next(error);
    }
  }
}
