import { FunctionComponent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface NavBarProps {}

const NavBar: FunctionComponent<NavBarProps> = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

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
              <a className="nav-link" href="/Home">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Recipes">
                Recipes
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/About">
                About us
              </a>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/Profile">
                    User Profile
                    <i className="fa-solid fa-user-gear ms-2"></i>
                  </a>
                </li>
              </>
            ) : (
              <></>
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
