import { type NextFunction, type Request, type Response } from "express";
import Model from "../models/ConversationModel";
import Database from "../config/Database";
import { type ConversationObj } from "../types/Ambient";
import ConversationDTO from "../dtos/ConversationDTO";

const database = new Database();

export default class ConversationController {
  public async findAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result: ConversationObj[] = await Model.find();

      const conversationList: ConversationObj[] = [];
      result.forEach((conversation) => {
        conversationList.push(
          ConversationDTO.builder()
            .setId(conversation.id!)
            .setWs(conversation.ws!)
            .setMessages(conversation.messages)
            .build()
        );
      });

      response.status(200).json(conversationList);
    } catch (error) {
      next(error);
    }
  }

  public async findById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string | undefined = request.params.id;

    try {
      if (id) {
        const result: ConversationObj | null = await Model.findById(id);
        if (!result) {
          throw new Error("Conversation not found");
        }

        const conversation: ConversationObj = ConversationDTO.builder()
          .setId(result.id!)
          .setWs(result.ws!)
          .setMessages(result.messages)
          .build();

        response.status(200).json(conversation);
      } else {
        throw new Error("Missing request data");
      }
    } catch (error) {
      next(error);
    }
  }

  public async createOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const body: ConversationObj = request.body;

    try {
      await database.createTransaction();
      const conversation = new Model(body);
      const result: ConversationObj = await conversation.save();

      const conversationDTO: ConversationObj = ConversationDTO.builder()
        .setId(result.id!)
        .setWs(result.ws!)
        .setMessages(result.messages)
        .build();

      await database.commitTransaction();
      response.status(201).json(conversationDTO);
    } catch (error) {
      await database.abortTransaction();
      next(error);
    }
  }

  public async updateOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string | undefined = request.params.id;
    const body: ConversationObj = request.body;

    try {
      await database.createTransaction();
      await Model.findByIdAndUpdate(id, body);

      await database.commitTransaction();
      response.status(204).end();
    } catch (error) {
      await database.abortTransaction();
      next(error);
    }
  }

  public async deleteOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const id: string | undefined = request.params.id;

    try {
      await database.createTransaction();
      await Model.findByIdAndDelete(id);

      await database.commitTransaction();
      response.status(204).end();
    } catch (error) {
      await database.abortTransaction();
      next(error);
    }
  }
}
