import { NextFunction, Request, Response } from "express";
import { ChatObj, MessageObj } from "../types/Ambient";
import model from "../models/ChatModel";
import _ from "lodash";
import Database from "../config/Database";
import AuthorizationService from "../services/AuthorizationService";
import ChatDTO from "../dtos/ChatDTO";
import mongoose from "mongoose";

/** Dependencies */
const database = new Database();
const authService: AuthorizationService = new AuthorizationService();

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
    next: NextFunction,
  ): Promise<void> {
    try {
      const result: ChatObj[] = await model.find();
      if (!result) {
        throw new Error("Chat no found");
      }

      const chatList: ChatObj[] = [];
      result.forEach((chat) => {
        chatList.push(
          ChatDTO.builder()
            .setId(chat.id!)
            .setParticipants({ ...chat.participants })
            .setConversation({ ...chat.conversation })
            .build(),
        );
      });

      response.status(200).json(chatList);
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
    next: NextFunction,
  ): Promise<void> {
    const id: string | undefined = request.params.id;

    try {
      if (id) {
        const result: ChatObj | null = await model.findById(id);
        if (!result) {
          throw new Error("Chat no found");
        }

        const chat: ChatObj = ChatDTO.builder()
          .setId(result.id!)
          .setParticipants({ ...result.participants })
          .setConversation({ ...result.conversation })
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
    next: NextFunction,
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const body: ChatObj = request.body;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (id && body && auth) {
        const validation: any = await authService.validateAccessToken(id, auth);

        if (validation.status !== 200 && validation.status !== 204) {
          throw new Error("Invalid token");
        } else if (validation.status === 200) {
          response.status(401).json(await validation.json());
          return;
        }

        database.createTransaction();
        const chat = new model(body);
        const result: ChatObj = await chat.save();

        const chatDTO: ChatObj = ChatDTO.builder()
          .setId(result.id!)
          .setParticipants({ ...result.participants })
          .setConversation({ ...result.conversation })
          .build();

        database.commitTransaction();
        response.status(201).json(chatDTO);
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      database.abortTransaction();
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
    next: NextFunction,
  ): Promise<void> {
    const userId: string | undefined = request.params.userId;
    const chatId: string | undefined = request.params.chatId;
    const body: ChatObj | undefined = request.body;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (userId && chatId && body && auth) {
        const validation: any = await authService.validateAccessToken(
          userId,
          auth,
        );

        if (validation.status !== 200 && validation.status !== 204) {
          throw new Error("Invalid token");
        } else if (validation.status === 200) {
          response.status(401).json(await validation.json());
          return;
        }

        database.createTransaction();
        await model.findByIdAndUpdate(chatId, body);

        database.commitTransaction();
        response.status(204).json();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      database.abortTransaction();
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
    next: NextFunction,
  ): Promise<void> {
    const userId: string | undefined = request.params.userId;
    const chatId: string | undefined = request.params.chatId;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (userId && chatId && auth) {
        const validation: any = await authService.validateAccessToken(
          userId,
          auth,
        );

        if (validation.status !== 200 && validation.status !== 204) {
          throw new Error("Invalid token");
        } else if (validation.status === 200) {
          response.status(401).json(await validation.json());
          return;
        }

        database.createTransaction();
        await model.findByIdAndDelete(chatId);

        database.commitTransaction();
        response.status(204).end();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      database.abortTransaction();
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
    next: NextFunction,
  ): Promise<void> {
    const userId: string | undefined = request.params.userId;
    const chatId: string | undefined = request.params.chatId;
    const body: MessageObj | undefined = request.body;
    const auth: string | undefined = request.header("Authorization");

    try {
      if (userId && chatId && body && auth) {
        const validation: any = await authService.validateAccessToken(
          userId,
          auth,
        );

        if (validation.status !== 200 && validation.status !== 204) {
          throw new Error("Invalid token");
        } else if (validation.status === 200) {
          response.status(401).json(await validation.json());
          return;
        }

        const message: MessageObj = {
          sender: new mongoose.Types.ObjectId(userId),
          message: body.message,
        } as MessageObj;

        database.createTransaction();
        await model.findByIdAndUpdate(chatId, {
          $push: { conversation: message },
        });

        database.commitTransaction();
        response.status(204).end();
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      database.abortTransaction();
      next(error);
    }
  }
}
