import { MongoMemoryServer } from "mongodb-memory-server";
import { UserObj } from "../../types/Ambient";
import App from "../../config/App";
import model from "../../models/UserModel";
import express from "express";
import mongoose from "mongoose";
import chaiHttp from "chai-http";
import chai, { expect } from "chai";

/**
 * User tests class.
 */
describe("User tests", () => {
  /** Properties */
  chai.use(chaiHttp);
  let memorydb: MongoMemoryServer;
  let userId: mongoose.Schema.Types.ObjectId;
  let token: string;
  const userObj: UserObj = {
    username: "test",
    password: "test",
    email: "test@email.com",
    contacts: [],
    picture: null,
    token: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const newUser: Object = {
    username: "test",
    password: "test",
    email: "test2@email.com",
  };

  /** Dependencies */
  const server: App = new App(express());
  const app = server.app;

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
    await model.deleteMany({});

    const newUser = new model(userObj);
    const user = await newUser.save();

    userId = user.id;

    chai
      .request(app)
      .post(`/auth/sign/user-token/${userId}`)
      .set("Content-Type", "application/json")
      .send({ password: userObj.password })
      .end((err, res) => {
        console.log(res);
        
        token = res.body.data.token;
      });
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
    const result = await chai.request(app).get("/user");

    expect(result).to.have.status(200);
    expect(result.body).to.be.an("array");
  });

  /**
   * Validates User findById method.
   *
   * @async
   */
  it("Should return only one user", async () => {
    const result = await chai.request(app).get(`/user/${userId}`);

    expect(result).to.have.status(200);
    expect(result.body).to.be.an("object");
  });

  /**
   * Validates User findByEmail method.
   *
   * @async
   */
  it("Should return only one user by email", async () => {
    const result = await chai.request(app).get(`/user/email/${userObj.email}`);

    expect(result).to.have.status(200);
    expect(result.body).to.be.an("object");
  });

  /**
   * Validates User createOne method.
   *
   * @async
   */
  it("Should post a new user", async () => {
    const result = await chai.request(app).post("/user").send(newUser);

    expect(result).to.have.status(201);
    expect(result.body).to.be.an("object");
  });

  /**
   * Validates User updateOne method.
   *
   * @async
   */
  it("Should return status code 204 for user update", async () => {
    const result = await chai.request(app).put(`/user/${userId}`).send(newUser);

    expect(result).to.have.status(204);
  });

  /**
   * Validates User deleteOne method.
   *
   * @async
   */
  it("Should return status code 204 for user deletion", async () => {
    const result = await chai.request(app).delete(`/user/${userId}`);

    expect(result).to.have.status(204);
  });
});
