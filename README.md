# WebSocket protocol implementation

### Overview
On going TypeScript Back-End api to be used as a chat application. Being built concurrently with [web-crawler](https://github.com/rafaeltxc/web-crawler/tree/main). Back-end module for [webSocket-frontend-module](https://github.com/rafaeltxc/webSocket-frontend-module).

### Features
The TypeScript back-end is designed to support various chat functionalities, including:
 - Public Rooms: Users can join anonymously or with authenticated accounts.
 - Private Rooms: Exclusive spaces for two or more logged users.
    
### Configuration
Before running the application, create a new .env file in the root directory and populate it with the following properties:
```console
PORT=number                // Port that the Back-End will run.
ENCRYPTION_KEY=string      // Key to handle encryptation.
AUTHORIZATION_KEY=string   // Key to handle token creation.
URL=string                 // MongoDB URL.
MONGO_NAME=string          // MondoDB database name.
MONGO_USER=string          // MongoDB user to login.
MONGO_PASS=string          // MongoDB password to login.
```

### Usage
Clone the repository:
```console
git clone https://github.com/rafaeltxc/webSocket-backend-module
cd ./webSocket-backend-module
```

Install the dependencies:
```console
npm install 
```

Start the application:
```console
npm start 
```

The application should initiate without any issues on the configured port.
