import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { addUser } from "../services/userService";

interface RegisterPageProps {}

const RegisterPage: FunctionComponent<RegisterPageProps> = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
      terms: Yup.boolean().oneOf(
        [true],
        "You must accept the terms and conditions",
      ),
    }),
    onSubmit: async (values) => {
      try {
        await addUser({
          id: 0,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        });
        toast.success("Account created successfully! Please log in.");
        navigate("/login");
      } catch (error: any) {
        const msg =
          error?.response?.data ||
          "Failed to create account. Please try again.";
        toast.error(msg);
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
                <div className="d-flex align-items-start justify-content-center h-100">
                  <div className="col-10 col-xl-8 pt-3 pb-3 border-radius-10">
                    <img
                      className="img-fluid rounded mb-4"
                      loading="lazy"
                      src="/RecipesWallpaper.png"
                      width="400"
                      height="100"
                      alt="Register visual food"
                    />
                    <hr style={{ color: "#5F9598" }} />
                    <h2 className="h1 mb-4" style={{ color: "#061E29" }}>
                      Start your cooking journey with us.
                    </h2>
                    <p className="lead m-0" style={{ color: "#1D546D" }}>
                      Create your account to save recipes, share your ideas, and
                      discover meals you’ll love every day.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-5">
                        <h3 style={{ color: "#5F9598" }}>Sign Up</h3>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row gy-3 gy-md-4 overflow-hidden">
                      <div className="col-12 col-md-6">
                        <label htmlFor="firstName" className="form-label">
                          First name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          id="firstName"
                          placeholder="First name"
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.firstName &&
                          formik.errors.firstName && (
                            <div className="text-danger small mt-1">
                              {formik.errors.firstName}
                            </div>
                          )}
                      </div>
                      <div className="col-12 col-md-6">
                        <label htmlFor="lastName" className="form-label">
                          Last name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          id="lastName"
                          placeholder="Last name"
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.lastName && formik.errors.lastName && (
                          <div className="text-danger small mt-1">
                            {formik.errors.lastName}
                          </div>
                        )}
                      </div>
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
                          placeholder="******"
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
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm password{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          id="confirmPassword"
                          placeholder="******"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.confirmPassword &&
                          formik.errors.confirmPassword && (
                            <div className="text-danger small mt-1">
                              {formik.errors.confirmPassword}
                            </div>
                          )}
                      </div>
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="terms"
                            id="terms"
                            checked={formik.values.terms}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label
                            className="form-check-label text-secondary"
                            htmlFor="terms"
                          >
                            I agree to the{" "}
                            <a
                              href="/"
                              className="link-secondary text-decoration-none"
                            >
                              terms and conditions
                            </a>
                          </label>
                          {formik.touched.terms && formik.errors.terms && (
                            <div className="text-danger small mt-1">
                              {formik.errors.terms}
                            </div>
                          )}
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
                            Create account
                          </button>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-center">
                          <a
                            onClick={() => navigate("/")}
                            href="/"
                            className="btn btn-lg w-75"
                            style={{
                              backgroundColor: "transparent",
                              color: "#1D546D",
                              border: "1px solid #1D546D",
                            }}
                          >
                            Back to Home Page
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
                          onClick={() => navigate("/login")}
                          href="#!"
                          style={{ color: "#5F9598" }}
                          className="link-secondary text-decoration-none"
                        >
                          Already have an account? Log in
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

export default RegisterPage;
