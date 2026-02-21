import { useFormik } from "formik";
import { FunctionComponent } from "react";
import * as yup from "yup";
import { addCard } from "../services/RecipeService";
import { toast } from "react-toastify";

interface CreateCardProps {
  onHide: () => void;
  refresh: () => void;
  category?: string;
}

const CreateCard: FunctionComponent<CreateCardProps> = ({
  onHide,
  refresh,
  category = "Main",
}) => {
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      imageUrl: "",
      isLiked: false,
    },
    validationSchema: yup.object({
      title: yup.string().required().min(2),
      description: yup.string().required().min(2),
      imageUrl: yup.string().required().url(),
      isLiked: yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        await addCard({ ...values, category });
        toast.success("Recipe created successfully");
        formik.resetForm();
        refresh();
        onHide();
      } catch (err: any) {
        if (err?.isAuthError) {
          toast.error("You must be logged in to create a recipe.");
          return;
        }
        const status = err?.response?.status;
        const apiMessage = err?.response?.data;
        const fallback = err?.message || "Failed to create recipe";
        toast.error(
          apiMessage || (status ? `${fallback} (HTTP ${status})` : fallback),
        );
      }
    },
  });

  return (
    <>
      <div className="w-100 p-2">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              name="title"
              id="title"
              placeholder="Card Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{
                backgroundColor: "#0d2d3d",
                color: "#F3F4F4",
                borderColor: "#5F9598",
              }}
            />
            <label htmlFor="title" style={{ color: "#5F9598" }}>
              Dish Name *
            </label>
            {formik.touched.title && formik.errors.title && (
              <span className="text-danger">{formik.errors.title}</span>
            )}
          </div>

          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              name="description"
              id="description"
              placeholder="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{
                height: "100px",
                backgroundColor: "#0d2d3d",
                color: "#F3F4F4",
                borderColor: "#5F9598",
              }}
            />
            <label htmlFor="description" style={{ color: "#5F9598" }}>
              Making Description *
            </label>
            {formik.touched.description && formik.errors.description && (
              <span className="text-danger">{formik.errors.description}</span>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="url"
              className="form-control"
              name="imageUrl"
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={formik.values.imageUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{
                backgroundColor: "#0d2d3d",
                color: "#F3F4F4",
                borderColor: "#5F9598",
              }}
            />
            <label htmlFor="imageUrl" style={{ color: "#5F9598" }}>
              Photo Link *
            </label>
            {formik.touched.imageUrl && formik.errors.imageUrl && (
              <span className="text-danger">{formik.errors.imageUrl}</span>
            )}
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="isLiked"
              id="isLiked"
              checked={formik.values.isLiked}
              onChange={formik.handleChange}
            />
            <label
              className="form-check-label"
              htmlFor="isLiked"
              style={{ color: "#F3F4F4" }}
            >
              Mark as Favorite
            </label>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn flex-fill"
              type="button"
              style={{
                backgroundColor: "#1D546D",
                borderColor: "#dc3545",
                color: "#dc3545",
              }}
              onClick={() => {
                formik.resetForm();
                onHide();
              }}
            >
              ✕ Cancel
            </button>
          </div>

          <button
            className="btn w-100 mt-3"
            type="submit"
            disabled={!formik.dirty || !formik.isValid}
            style={{
              backgroundColor: "#5F9598",
              color: "#fff",
              borderColor: "#5F9598",
            }}
          >
            ✓ Create Recipe
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateCard;
