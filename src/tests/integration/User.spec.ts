import "dotenv/config";
import { MongoMemoryServer } from "mongodb-memory-server";
import { type UserObj } from "../../types/Ambient";
import Model from "../../models/UserModel";
import Helper from "../../utils/Helper";
import mongoose from "mongoose";
import chaiHttp from "chai-http";
import jwt from "jsonwebtoken";
import chai, { expect } from "chai";
import App from "../../config/App";
import express from "express";

/**
 * User tests class.
 */
describe("User tests", () => {
  /** Properties */
  chai.use(chaiHttp);
  const app = new App(express());
  let memorydb: MongoMemoryServer;
  let userId: mongoose.Schema.Types.ObjectId;
  let token: string;
  const userObj: UserObj = {
    username: "test",
    password: "test",
    email: "test@email.com"
  };
  const newUser: Object = {
    username: "test",
    password: "test",
    email: "test2@email.com"
  };
  const key: string = process.env.AUTHORIZATION_KEY!;

  /** Dependencies */
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
    await Model.deleteMany({});

    const newUser = new Model(userObj);
    const user = await newUser.save();

    const newToken = jwt.sign({ id: user.id }, key, {
      expiresIn: "10s"
    });

    userId = user.id;
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
   * Validates User findAll methods.
   *
   * @async
   */
  it("Should return all users", async () => {
    const result = await chai.request(app.app).get("/user");

    expect(result).to.have.status(200);
    expect(result.body).to.be.an("array");
  });

  /**
   * Validates User findById method.
   *
   * @async
   */
  it("Should return only one user", async () => {
    const result = await chai.request(app.app).get(`/user/${userId}`);

    expect(result).to.have.status(200);
    expect(result.body).to.be.an("object");
  });

  /**
   * Validates User findByEmail method.
   *
   * @async
   */
  it("Should return only one user by email", async () => {
    const result = await chai.request(app.app).get(`/user/email/${userObj.email}`);

    expect(result).to.have.status(200);
    expect(result.body).to.be.an("object");
  });

  /**
   * Validates User createOne method.
   *
   * @async
   */
  it("Should post a new user", async () => {
    const result = await chai.request(app.app).post("/user").send(newUser);

    expect(result).to.have.status(201);
    expect(result.body).to.be.an("object");
  });

  /**
   * Validates User updateOne method.
   *
   * @async
   */
  it("Should return status code 204 for user update", async () => {
    const result = await chai
      .request(app.app)
      .put(`/user/${userId}`)
      .set("Authorization", token)
      .send(newUser);

    expect(result).to.have.status(204);
  });

  /**
   * Validates User deleteOne method.
   *
   * @async
   */
  it("Should return status code 204 for user deletion", async () => {
    const result = await chai
      .request(app.app)
      .delete(`/user/${userId}`)
      .set("Authorization", token);

    expect(result).to.have.status(204);
  });
});
