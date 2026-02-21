import axios from "./axios";
import User from "../interfaces/User";
// Define the base API URL for users //
const api: string =
  process.env.REACT_APP_API_USERS || "http://localhost:9000/api/users";

// login - using POST method as per API documentation
export function checkUser(credentials: { email: string; password: string }) {
  return axios.post(`${api}/login`, credentials);
}
// register service //
// register-
export function addUser(newUser: User) {
  return axios.post(`${api}/register`, {
    name: { first: newUser.firstName, last: newUser.lastName },
    email: newUser.email,
    password: newUser.password,
  });
}
// get user services  //
export function getUserById() {
  // get userId from localStorage
  const userId = localStorage.getItem("userId");

  // get request for user full details
  return axios.get(`${api}/${userId}`);
}
// update user //
export function updateUser(userId: string, updatedUser: User) {
  const body: any = {
    name: { first: updatedUser.firstName, last: updatedUser.lastName },
    email: updatedUser.email,
  };
  if (updatedUser.password) body.password = updatedUser.password;
  return axios.put(`${api}/${userId}`, body);
}

// delete user //
export function deleteUser(userId: string) {
  return axios.delete(`${api}/${userId}`);
}

// get all users //
export function getAllUsers() {
  return axios.get(api);
}

// admin - get all users //
export function getAllUsersAdmin() {
  return axios.get(`${api}/admin/users`);
}

// admin - update any user //
export function updateUserByAdmin(
  userId: string,
  updatedUser: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  },
) {
  const body: any = {
    name: {
      first: updatedUser.firstName,
      last: updatedUser.lastName,
    },
    email: updatedUser.email,
  };

  if (updatedUser.password) body.password = updatedUser.password;

  return axios.put(`${api}/admin/users/${userId}`, body);
}

// admin - delete any user //
export function deleteUserByAdmin(userId: string) {
  return axios.delete(`${api}/admin/users/${userId}`);
}
