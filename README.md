## Chat API

### Overview
Node TypeScript application designed to handle chat requests for a chatting application. It incorporates a NoSQL database connection and WebSockets implementation to facilitate seamless real-time communication.

### Features
 - **NoSQL Database Connectivity:**

    Efficiently manages chat data with flexible NoSQL database integration.

 - **WebSockets Integration:**

    Enables instant messaging and real-time updates for a responsive chat experience.

 - **Room Partitioning:**

    Organizes chat rooms for two or more users, complete with conversation history.

 - **User Authentication:**

    Securely restricts access, allowing only authorized users to participate in the chat.

### Configuration
Before lauching the application, create a new .env file in the root directory and populate it with the following properties:
```console
PORT=number                // Port that the Back-End will run.
ENCRYPTION_KEY=string      // Key to handle encryptation.
AUTHORIZATION_KEY=string   // Key to handle token creation.
URL=string                 // MongoDB URL.
MONGO_NAME=string          // MondoDB database's name.
MONGO_USER=string          // MongoDB user to login.
MONGO_PASS=string          // MongoDB password to login.
```

### Usage
After installing all dependencies and configuring the necessary data, start the server with:
```console
yarn/npm run dev
```

The WebSockets right after connection, should receive a json with the following data:
```console
{
    room: uuid,         // Room id.
    message: string,    // Message to be broadcasted.
    meta: string        // Action to be taken.
}
```

The meta option can receive three options:
 - **join:** Join in the room with the specified uuid.
 - **message:** Will send the message in the "message" property to the other users (if connected to the room).
 - **leave:** Leave the room and kill connection.

### Documentation
The API documentation can be found in the following URL after the application has started:
```console
http://localhost:{port}/api/v1/docs/swagger
```

