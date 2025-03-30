# Collaborative Presentation Software

A real-time presentation tool built with React (frontend) and Node.js (backend) using Socket.IO for collaboration and MongoDB for persistence.

## Setup

1. Clone the project or create it in StackBlitz.
2. Install dependencies: `npm install`.
3. Set up a MongoDB instance and update the `MONGO_URI` in `.env`.
4. Run the server: `npm start`.
5. Open your browser to `http://localhost:3000` (or the StackBlitz URL).

## Features

- Create or join presentations with a nickname (no login required).
- Real-time collaboration with Socket.IO.
- Creator can add slides; editors can modify content.
- Persistent storage with MongoDB.
