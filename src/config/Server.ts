import "dotenv/config";
import express from "express";
import App from "./App";
import Database from "./Database";

/** Properties */
const PORT: number | undefined = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : undefined;

/** Dependencies */
const mongodb: Database = new Database();
export const server: App = new App(express());

/**
 * Start Express server listening at specified port.
 */
const listeningServer = server.app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

/**
 * Server on listening configuration.
 */
listeningServer.on("listening", async () => {
  try {
    await mongodb.connect();
    console.log("Connection with the Database established");
  } catch (error) {
    console.error({
      Message: "Connection with the Database could not be established",
      Error: error,
    });
  }
});

/**
 * Server on error configuration.
 */
listeningServer.on("error", (error: any) => {
  if (error.code === "EADDRINUSE") {
    console.log("Server could no be loaded, adresses already in use");
  } else {
    console.error(error);
  }
});
