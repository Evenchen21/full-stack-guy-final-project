import { FunctionComponent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

interface NavBarProps {}

interface TokenPayload {
  _id: string;
  email: string;
  isAdmin: boolean;
}

const NavBar: FunctionComponent<NavBarProps> = () => {
  const { isLoggedIn, logout, token } = useAuth();
  const navigate = useNavigate();

  let isAdmin = false;
  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      isAdmin = decoded.isAdmin;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const handleLogout = () => {
    logout();
    toast.success("You have logged out.. see you!");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg app-navbar">
      <div className="container-fluid">
        <img
          src="/Logo_site_myCook.png"
          alt="MyCookBook Logo"
          style={{ width: "200px", objectFit: "contain" }}
        />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/Home">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Recipes">
                Recipes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/About">
                About us
              </NavLink>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/Profile">
                    User Profile
                    <i className="fa-solid fa-user-gear ms-2"></i>
                  </NavLink>
                </li>
              </>
            ) : (
              <></>
            )}
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/users">
                  Settings <i className="fa-solid fa-cogs ms-1"></i>
                </NavLink>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 ml-10">
            {isLoggedIn ? (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    SignUp
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              className="btn"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
                border: "1px solid var(--color-accent)",
              }}
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
