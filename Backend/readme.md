# FSProject Backend (Node.js + Express + MongoDB)

## Project Description

This is the backend API of FSProject. It provides authentication, user management, and recipe/card CRUD endpoints for the frontend application.

## Main Features

- REST API built with Express
- MongoDB integration with Mongoose models
- User registration and login with hashed passwords (`bcrypt`)
- JWT authentication (`jsonwebtoken`)
- Role-based admin routes (admin-only middleware)
- Card CRUD endpoints
- Central request logging (`morgan`)
- CORS enabled for localhost clients

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Joi (request validation)
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- dotenv
- cors
- morgan

## Backend Folder Structure

- `Backend/server.js` — server bootstrap, middleware, routes, DB connection
- `Backend/routes/users.js` — auth, user profile, and admin user routes
- `Backend/routes/cards.js` — card routes and admin card routes
- `Backend/models/users.js` — user schema/model
- `Backend/models/card.js` — card schema/model
- `Backend/middlewares/auth.js` — authenticated user middleware
- `Backend/middlewares/adminMiddleware.js` — admin-only middleware
- `Backend/seed.js` — optional seed script using `db.json`
- `Backend/db.json` — seed source data

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB instance / MongoDB Atlas connection string

## Environment Variables

Create `Backend/.env`:

```env
DB_HOST=mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
PORT=8000
```

Required:

- `DB_HOST` — MongoDB connection URI
- `JWT_SECRET` — used to sign/verify auth tokens

Optional:

- `PORT` — defaults to `8000` if not provided

## Installation & Run

From `Backend/`:

1. Install dependencies:
   - `npm install`
2. Start server:
   - `npm start`

Default server URL: `http://localhost:8000`

## API Base Paths

- `/api/users`
- `/api/cards`

## Authentication

- Login returns a JWT token (`POST /api/users/login`).
- Send token in header:

```http
Authorization: Bearer <token>
```

Protected routes require valid token. Admin routes require `isAdmin: true` in token payload.

## Endpoints Overview

### User Routes

- `POST /api/users/register` — register user
- `POST /api/users/login` — login and receive JWT
- `GET /api/users/:id` — get user by id (auth required)
- `PUT /api/users/:id` — update own profile (auth + owner check)
- `DELETE /api/users/:id` — delete own profile (auth + owner check)

### Admin User Routes

- `GET /api/users/admin/users` — list all users (admin)
- `GET /api/users/admin/users/:id` — get any user (admin)
- `POST /api/users/admin/users` — create user (admin)
- `PUT /api/users/admin/users/:id` — update any user (admin)
- `DELETE /api/users/admin/users/:id` — delete any user (admin)

### Card Routes

- `GET /api/cards` — list all cards
- `GET /api/cards/:id` — get card by id
- `POST /api/cards` — create card (auth)
- `PUT /api/cards/:id` — update card (auth)
- `DELETE /api/cards/:id` — delete card (auth)
- `POST /api/cards/:id/like` — like/unlike card (auth)

### Admin Card Routes

- `GET /api/cards/admin/cards` — list all cards (admin)
- `GET /api/cards/admin/cards/:id` — get any card (admin)
- `POST /api/cards/admin/cards` — create card (admin)
- `PUT /api/cards/admin/cards/:id` — update any card (admin)
- `DELETE /api/cards/admin/cards/:id` — delete any card (admin)

## Validation Rules (Summary)

- User registration:
  - `name.first`: 2-20 chars
  - `name.last`: 2-20 chars
  - `email`: valid email
  - `password`: 6-1024 chars
- Card creation:
  - `title`: 2-100 chars
  - `description`: 2-500 chars
  - `imageUrl`: valid URI

## Seed Data (Optional)

The repository includes `seed.js` and `db.json` for initializing demo data.

If needed, run from `Backend/`:

- `node seed.js`

## CORS Behavior

Backend allows requests from localhost origins and common headers/methods used by the frontend.

## `.env` and Git Submission Notes

- Do **not** commit real secrets to git.
- Keep real values only in local `.env`.
- Recommended: commit `Backend/.env.example` with placeholders only.
- For submission, document required keys and setup instructions without exposing credentials.
