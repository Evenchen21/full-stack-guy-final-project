v# FSProject — Frontend + Backend

## Project Description

FSProject is a full-stack web application built with:

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: MongoDB

The system allows users to work with recipe/card content through a client UI that communicates with a REST API.

## Project Contents

- `Frontend/` — client-side application (pages, components, routing, auth context, services)
- `Backend/` — API server (routes, middleware, models, DB connection)

## Main Functionality

- User authentication flows (register/login and related user actions)
- Card/recipe management flows (create, read, update, delete according to permissions)
- Protected actions through auth middleware and token-based flow
- Client-server communication via HTTP API requests

## How Integration Works

1. Frontend sends requests with `axios` to backend endpoints.
2. Backend handles requests in route files under `Backend/routes/`.
3. Middleware validates auth/roles and request data.
4. Backend reads/writes data in MongoDB.
5. Backend returns JSON responses used by the frontend UI.

Base API routes:

- `/api/users`
- `/api/cards`

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB connection string

## Backend Setup

1. Go to backend folder:
   - `cd Backend`
2. Install dependencies:
   - `npm install`
3. Create a `.env` file in `Backend/`:

   ```env
   DB_HOST=your_mongodb_connection_string
   PORT=8000
   ```

4. Start backend server:
   - `npm start`

Backend default URL: `http://localhost:8000`

## Frontend Setup

1. Open a new terminal and go to frontend folder:
   - `cd Frontend`
2. Install dependencies:
   - `npm install`
3. Start frontend:
   - `npm start`

Frontend default URL: `http://localhost:3000`

## Running Both Together

Use two terminals:

- Terminal 1: `cd Backend && npm start`
- Terminal 2: `cd Frontend && npm start`

## Build Frontend

From `Frontend/`:

- `npm run build`

## `.env` / Git Notes

- Do not push secrets or personal credentials to git.
- Keep real values only in local `.env` files.
- Recommended: commit an `.env.example` file with placeholder keys only.
- For assignment submission: include environment instructions (required keys and format) without exposing sensitive values.
