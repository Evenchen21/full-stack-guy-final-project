import { useFormik } from "formik";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";

interface ForgotPasswordPageProps {}

const ForgotPasswordPage: FunctionComponent<ForgotPasswordPageProps> = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Forgot password payload", values);
        toast.success("Reset link sent! Please check your email.");
        navigate("/login");
      } catch (error) {
        toast.error("Failed to send reset link. Please try again.");
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
                      alt="Forgot password visual"
                    />
                    <hr style={{ color: "#5F9598" }} />
                    <h2 className="h1 mb-4" style={{ color: "#061E29" }}>
                      Forgot the password?
                    </h2>
                    <p className="lead m-0" style={{ color: "#1D546D" }}>
                      Enter your email and we will send you a secure reset link
                      so you can get back to cooking in no time.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-5">
                        <h3 style={{ color: "#5F9598" }}>Reset password</h3>
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
                            Send reset link
                          </button>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-center">
                          <a
                            onClick={() => navigate("/login")}
                            href="/login"
                            className="btn btn-lg w-75"
                            style={{
                              backgroundColor: "transparent",
                              color: "#1D546D",
                              border: "1px solid #1D546D",
                            }}
                          >
                            Back to Log in
                          </a>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-12">
                      <hr className="mt-5 mb-4 border-secondary-subtle" />
                      <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end">
                        <a
                          onClick={() => navigate("/register")}
                          href="/register"
                          style={{ color: "#5F9598" }}
                          className="link-secondary text-decoration-none"
                        >
                          Create new account
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

export default ForgotPasswordPage;
