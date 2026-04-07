import axios from "./axios";
import User from "../interfaces/User";
// Base URL for all user-related API calls; falls back to empty string if env var is not set //
const api: string = process.env.REACT_APP_API_USERS || "";

// Send login credentials and receive a JWT token back //
export function checkUser(credentials: { email: string; password: string }) {
  return axios.post(`${api}/login`, credentials);
}

// Request a password reset email for the given user email //
export function requestPasswordReset(email: string) {
  return axios.post(`${api}/forgot-password`, { email });
}

// Submit a new password using a reset token from email link //
export function resetPassword(token: string, password: string) {
  return axios.post(`${api}/reset-password`, { token, password });
}

// Register a new user account //
export function addUser(newUser: User) {
  // Shape the payload to match the structure the backend expects //
  return axios.post(`${api}/register`, {
    name: { first: newUser.firstName, last: newUser.lastName },
    email: newUser.email,
    password: newUser.password,
  });
}
// Fetch the full profile of the currently logged-in user //
export function getUserById() {
  // Read the userId saved in localStorage at login time //
  const userId = localStorage.getItem("userId");
  return axios.get(`${api}/${userId}`);
}
// Update the logged-in user's own profile; only sends password if a new one was provided //
export function updateUser(userId: string, updatedUser: User) {
  const body: any = {
    name: { first: updatedUser.firstName, last: updatedUser.lastName },
    email: updatedUser.email,
  };
  // Only include password in the request if the user actually changed it //
  if (updatedUser.password) body.password = updatedUser.password;
  return axios.put(`${api}/${userId}`, body);
}

// Delete the logged-in user's own account //
export function deleteUser(userId: string) {
  return axios.delete(`${api}/${userId}`);
}

// Fetch every user (available to logged-in users) //
export function getAllUsers() {
  return axios.get(api);
}

// ADMIN — Fetch every user via the admin-only endpoint //
export function getAllUsersAdmin() {
  return axios.get(`${api}/admin/users`);
}

// ADMIN — Update any user by their ID; only includes changed fields in the request body //
export function updateUserByAdmin(
  userId: string,
  updatedUser: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    isAdmin?: boolean;
  },
) {
  const body: any = {
    name: {
      first: updatedUser.firstName,
      last: updatedUser.lastName,
    },
    email: updatedUser.email,
  };

  // Conditionally append optional fields so we don’t overwrite with undefined //
  if (updatedUser.password) body.password = updatedUser.password;
  if (updatedUser.isAdmin !== undefined) body.isAdmin = updatedUser.isAdmin;

  return axios.put(`${api}/admin/users/${userId}`, body);
}

// ADMIN — Permanently delete any user by their ID //
export function deleteUserByAdmin(userId: string) {
  return axios.delete(`${api}/admin/users/${userId}`);
}
