export default interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
}
