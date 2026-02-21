import "./App.css";
import NavBar from "./components/navBar";
import HomePage from "./components/homePage";
import LoginPage from "./components/loginPage";
import RegisterPage from "./components/registerPage";
import ForgotPasswordPage from "./components/forgotpasswordPage";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import AboutPage from "./components/aboutPage";
import UserProfilePage from "./components/userProfilePage";

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
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
