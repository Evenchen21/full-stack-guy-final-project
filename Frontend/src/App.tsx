import "./App.css";
import NavBar from "./components/navBar";
import HomePage from "./components/homePage";
import LoginPage from "./components/loginPage";
import RegisterPage from "./components/registerPage";
import ForgotPasswordPage from "./components/forgotpasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import AboutPage from "./components/aboutPage";
import UserProfilePage from "./components/userProfilePage";
import AdminUsersPage from "./components/AdminUsersPage";

function App() {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <div className="App">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
