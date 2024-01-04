import { type NextFunction, type Request, type Response } from "express";
import Model from "../models/RoomModel";
import Database from "../config/Database";
import { type RoomObj } from "../types/Ambient";
import RoomDTO from "../dtos/RoomDTO";

const database = new Database();

export default class RoomController {
  public async findAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result: RoomObj[] = await Model.find();

      const roomList: RoomObj[] = [];
      result.forEach((room) => {
        roomList.push(
          RoomDTO.builder()
            .setId(room.id!)
            .setWs(room.room)
            .setMessages(room.messages)
            .build()
        );
      });

      response.status(200).json(roomList);
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
        const result: RoomObj | null = await Model.findById(id);
        if (!result) {
          throw new Error("Room not found");
        }

        const room: RoomObj = RoomDTO.builder()
          .setId(result.id!)
          .setWs(result.room)
          .setMessages(result.messages)
          .build();

        response.status(200).json(room);
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
    const body: RoomObj = request.body;

    try {
      await database.createTransaction();
      const room = new Model(body);
      const result: RoomObj = await room.save();

      const roomDTO: RoomObj = RoomDTO.builder()
        .setId(result.id!)
        .setWs(result.room)
        .setMessages(result.messages)
        .build();

      await database.commitTransaction();
      response.status(201).json(roomDTO);
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
    const body: RoomObj = request.body;

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
