# FSProject Frontend (React + TypeScript)

## Project Description

This is the frontend application of FSProject. It is built with React and TypeScript, and communicates with a backend REST API for authentication, user profile management, and recipe/card operations.

## Main Features

- User authentication (login/register/logout)
- Token and userId persistence using `localStorage`
- Navigation with React Router
- Pages: Home, Login, Register, About, Profile, Forgot Password
- Recipe/Card flows (fetch/create/update/delete through API services)
- Global toast notifications (`react-toastify`)
- Auth header injection (`x-auth-token` and `Authorization: Bearer ...`) via Axios interceptor

## Tech Stack

- React 19
- TypeScript
- React Router DOM
- Axios
- React Bootstrap
- Formik + Yup
- React Toastify

## Folder Structure (Frontend)

- `Frontend/src/App.tsx` — app shell and routes
- `Frontend/src/context/AuthContext.tsx` — auth state provider (`token`, `userId`, `login`, `logout`)
- `Frontend/src/services/axios.ts` — axios instance + request/response interceptors
- `Frontend/src/services/userService.ts` — user/auth API calls
- `Frontend/src/services/RecipeService.ts` — card/recipe API calls
- `Frontend/src/components/` — UI pages and feature components

## Routes

- `/` and `/home`
- `/login`
- `/register`
- `/about`
- `/profile`
- `/forgot-password`

## Prerequisites

- Node.js (v18+ recommended)
- npm
- Running backend API server

## Environment Variables

Create `Frontend/.env` and set:

```env
REACT_APP_API_USERS=http://localhost:8000/api/users
REACT_APP_API_CARDS=http://localhost:8000/api/cards
```

Notes:

- `REACT_APP_API_USERS` is used by `userService.ts`
- `REACT_APP_API_CARDS` is used by `RecipeService.ts`
- If `REACT_APP_API_CARDS` is missing, the code fallback is `http://localhost:9000/api/cards`

## Installation & Run

From the `Frontend/` directory:

1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npm start`

App default URL: `http://localhost:3000`

## Available Scripts

From `Frontend/`:

- `npm start` — run development server
- `npm run build` — create production build
- `npm test` — run tests
- `npm run eject` — eject CRA configuration (irreversible)

## API Integration Summary

1. UI components call service functions in `src/services/`.
2. Service functions send HTTP requests using shared axios instance.
3. Axios interceptor automatically attaches auth token from `localStorage`.
4. Backend validates request and returns JSON response.
5. UI updates state and presents feedback to the user.

## `.env` and Git Submission Notes

- Do **not** commit real credentials or private keys.
- Keep sensitive values only in local `.env`.
- Recommended to commit `Frontend/.env.example` with placeholders.
- For submission, include setup instructions for required env keys..
