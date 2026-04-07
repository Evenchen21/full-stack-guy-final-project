import { FunctionComponent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/userService";

interface ResetPasswordPageProps {}

const ResetPasswordPage: FunctionComponent<ResetPasswordPageProps> = () => {
  // Used to redirect user after successful password reset //
  const navigate = useNavigate();
  // Reads token from URL query string: /reset-password?token=... //
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  // Formik manages form state, validation, and submit logic //
  const formik = useFormik({
    // Initial values for the password fields //
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    // Validation rules for new password and confirmation //
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    // Submit new password to backend using reset token //
    onSubmit: async (values) => {
      // Prevent request if token is missing from URL //
      if (!token) {
        toast.error("Reset token is missing or invalid.");
        return;
      }

      try {
        await resetPassword(token, values.password);
        // On success, show message and navigate to login //
        toast.success("Password updated successfully. Please log in.");
        navigate("/login");
      } catch (error: any) {
        // Show backend error if available, fallback to generic message //
        toast.error(
          error?.response?.data || "Failed to reset password. Try again.",
        );
      }
    },
  });

  return (
    <section
      className="p-3 p-md-4 p-xl-5"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="container">
        <div
          className="card border-light-subtle shadow-sm mx-auto"
          style={{ maxWidth: "640px" }}
        >
          <div className="card-body p-3 p-md-4 p-xl-5">
            <h3 className="mb-4" style={{ color: "#5F9598" }}>
              Set New Password
            </h3>

            {/* Reset password form fields */}
            <form onSubmit={formik.handleSubmit}>
              <div className="row gy-3 gy-md-4 overflow-hidden">
                <div className="col-12">
                  <label htmlFor="password" className="form-label">
                    New Password <span className="text-danger">*</span>
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
                    Confirm New Password <span className="text-danger">*</span>
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
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
