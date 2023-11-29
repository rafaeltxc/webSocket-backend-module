import { MongoMemoryServer } from "mongodb-memory-server";
import { ChatObj, MessageObj, UserObj } from "../../types/Ambient";
import App from "../../config/App";
import userModel from "../../models/UserModel";
import chatModel from "../../models/ChatModel";
import Helper from "../../utils/Helper";
import jwt from "jsonwebtoken";
import express from "express";
import mongoose from "mongoose";
import chaiHttp from "chai-http";
import chai, { expect } from "chai";

/**
 * Chat tests class.
 */
describe("Chat tests", () => {
  /** Properties */
  chai.use(chaiHttp);
  let memorydb: MongoMemoryServer;
  let userId1: mongoose.Schema.Types.ObjectId;
  let userId2: mongoose.Schema.Types.ObjectId;
  let chatId: mongoose.Schema.Types.ObjectId;
  let token: string;
  const userObjs: UserObj[] = [
    {
      username: "test",
      password: "test",
      email: "test@email.com",
    },
    {
      username: "test",
      password: "test",
      email: "test2@email.com",
    },
  ];
  const key: string = process.env.AUTHORIZATION_KEY!;

  /** Dependencies */
  const server: App = new App(express());
  const app = server.app;
  const helper: Helper = new Helper();

  /**
   * Before tests, initiate local memory Mongoose server.
   *
   * @async
   */
  before(async () => {
    memorydb = await MongoMemoryServer.create();
    const uri = memorydb.getUri();

    await mongoose.connect(uri);
  });

  /**
   * Before each test, clean and add database data.
   *
   * @async
   */
  beforeEach(async () => {
    await userModel.deleteMany({});

    const user = await userModel.insertMany(userObjs);
    userId1 = user[0].id;
    userId2 = user[1].id;

    const newToken = jwt.sign({ id: userId1 }, key, {
      expiresIn: "10s",
    });

    const chatObj: ChatObj = {
      participants: [userId1, userId2],
      conversation: [],
    };

    const newChat = new chatModel(chatObj);
    const result = await newChat.save();
    chatId = result.id;
    token = helper.concatWithSpaces("Bearer", newToken);
  });

  /**
   * After all tests, closes database connection.
   *
   * @async
   */
  after(async () => {
    await mongoose.disconnect();
    await memorydb.stop();
  });

  /**
   * Validates Chat findAll methods.
   */
  it("Should return all chats", async () => {
    const result = await chai.request(app).get("/chat");

    expect(result).to.have.status(200);
    expect(result.body).to.be.an("array");
  });

  /**
   * Validates Chat findById method.
   *
   * @async
   */
  it("Should return only one chat", async () => {
    const result = await chai.request(app).get(`/chat/${chatId}`);

    expect(result).to.have.status(200);
    expect(result.body).to.be.an("object");
  });

  /**
   * Validates Chat createOne method.
   *
   * @async
   */
  it("Should post a new chat", async () => {
    const newChat: Object = {
      participants: [userId1, userId2],
    };

    const result = await chai
      .request(app)
      .post(`/chat/${userId1}`)
      .set("Authorization", token)
      .send(newChat);

    expect(result).to.have.status(201);
    expect(result.body).to.be.an("object");
  });

  /**
   * Validates Chat updateOne method.
   *
   * @async
   */
  it("Should return status code 204 for chat update", async () => {
    const newChat: Object = {
      participants: [userId1, userId2],
    };

    const result = await chai
      .request(app)
      .put(`/chat/${userId1}/${chatId}`)
      .set("Authorization", token)
      .send(newChat);

    expect(result).to.have.status(204);
  });

  /**
   * Validates Chat deleteOne method.
   *
   * @async
   */
  it("Should return status code 204 for user deletion", async () => {
    const result = await chai
      .request(app)
      .delete(`/chat/${userId1}/${chatId}`)
      .set("Authorization", token);

    expect(result).to.have.status(204);
  });

  /**
   * Validates Chat addMessage method.
   *
   * @async
   */
  it("Should add message to existent chat", async () => {
    const newMessage: MessageObj = {
      sender: userId1,
      message: "test",
    };

    const result = await chai
      .request(app)
      .put(`/chat/add-message/${userId1}/${chatId}`)
      .set("Authorization", token)
      .send(newMessage);

    expect(result).to.have.status(204);
    expect(result.body).to.be.an("object");
  });
});
