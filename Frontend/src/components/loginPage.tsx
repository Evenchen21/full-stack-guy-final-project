import { useFormik } from "formik";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { checkUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
  const navigate = useNavigate(); // Get the login function from the authentication context
  const { login } = useAuth(); // Initialize Formik for form handling and validation

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await checkUser({
          email: values.email,
          password: values.password,
        });
        const token = res.data.token;
        const decodedToken: { _id: string } = jwtDecode(token);
        login(token, decodedToken._id);
        toast.success("Logged in successfully!");
        navigate("/");
      } catch (error) {
        toast.error("Login failed. Please check your email and password.");
        console.error("Login failed:", error);
      }
    },
  });

  return (
    <>
      <section
        className="p-3 p-md-4 p-xl-5"
        style={{ backgroundColor: "#000000" }}
      >
        <div className="container">
          <div className="card border-light-subtle shadow-sm">
            <div className="row g-0">
              <div
                className="col-12 col-md-6"
                style={{ backgroundColor: "#5F9598" }}
              >
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="col-10 col-xl-8 py-3 border-radius-10">
                    <img
                      className="img-fluid rounded mb-4"
                      loading="lazy"
                      src="/RecipesWallpaper.png"
                      width="400"
                      height="100"
                      alt="BootstrapBrain Logo"
                    />
                    <hr style={{ color: "#5F9598" }} />
                    <h2 className="h1 mb-4" style={{ color: "#061E29" }}>
                      We make Recipes that make you feel good.
                    </h2>
                    <p className="lead m-0" style={{ color: "#1D546D" }}>
                      Join our community of food lovers. Discover a world of
                      delicious recipes that will satisfy your cravings and
                      inspire your culinary creativity.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-5">
                        <h3 style={{ color: "#5F9598" }}>Log in</h3>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row gy-3 gy-md-4 overflow-hidden">
                      <div className="col-12">
                        <label htmlFor="email" className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          id="email"
                          placeholder="name@example.com"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                          <div className="text-danger small mt-1">
                            {formik.errors.email}
                          </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label htmlFor="password" className="form-label">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          id="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password && (
                          <div className="text-danger small mt-1">
                            {formik.errors.password}
                          </div>
                        )}
                      </div>
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="rememberMe"
                            id="rememberMe"
                            checked={formik.values.rememberMe}
                            onChange={formik.handleChange}
                          />
                          <label
                            className="form-check-label text-secondary"
                            htmlFor="rememberMe"
                          >
                            Keep me logged in
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-grid">
                          <button
                            className="btn btn-lg"
                            style={{
                              backgroundColor: "#1D546D",
                              color: "white",
                              border: "none",
                            }}
                            type="submit"
                          >
                            Log in now
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-12">
                      <hr className="mt-5 mb-4 border-secondary-subtle" />
                      <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end">
                        <a
                          href="/register"
                          style={{ color: "#5F9598" }}
                          className="link-secondary text-decoration-none"
                        >
                          Create new account
                        </a>
                        <a
                          href="/forgot-password"
                          style={{ color: "#5F9598" }}
                          className="link-secondary text-decoration-none"
                        >
                          Forgot password
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default LoginPage;
