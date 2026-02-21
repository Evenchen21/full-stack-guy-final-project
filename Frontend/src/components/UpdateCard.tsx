import { useFormik } from "formik";
import { FunctionComponent, useEffect, useState } from "react";
import * as yup from "yup";
import { getCardById, updateCard } from "../services/RecipeService";
import { toast } from "react-toastify";
import RecipesCard from "../interfaces/RecipesCard";
import Footer from "./Footer";

interface UpdateCardProps {
  onHide: () => void;
  cardId: string;
  refresh: () => void;
}

const UpdateCard: FunctionComponent<UpdateCardProps> = ({
  onHide,
  cardId,
  refresh,
}) => {
  const [initialValues, setInitialValues] = useState<RecipesCard>({
    title: "",
    description: "",
    imageUrl: "",
    isLiked: false,
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: yup.object({
      title: yup.string().required().min(2),
      description: yup.string().required().min(10),
      imageUrl: yup.string().required().url(),
      isLiked: yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        await updateCard(cardId, values);
        toast.success("Recipe updated ");
        refresh();
        onHide();
      } catch (err: any) {
        if (err?.isAuthError) {
          toast.error("You must be logged in to update a recipe.");
          return;
        }

        const status = err?.response?.status;
        const apiMessage = err?.response?.data;
        const fallback = err?.message || "Failed to update recipe";
        toast.error(
          status ? `${fallback} (HTTP ${status})` : apiMessage || fallback,
        );
      }
    },
  });

  useEffect(() => {
    if (!cardId) return;

    getCardById(cardId)
      .then((res: any) => {
        const card = res.data || {};
        setInitialValues({
          id: card.id,
          _id: card._id,
          title: card.title || "",
          description: card.description || "",
          imageUrl: card.imageUrl || card.image?.url || "",
          isLiked: Boolean(card.isLiked),
        });
      })
      .catch(() => {
        toast.error("Could not load recipe details");
      });
  }, [cardId]);

  return (
    <div className="w-100 p-4 rounded" style={{ backgroundColor: "#5F9598" }}>
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
          />
          <label htmlFor="title">Dish Name *</label>
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
            style={{ height: "100px" }}
          />
          <label htmlFor="description">Making Description *</label>
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
          />
          <label htmlFor="imageUrl">Photo Link *</label>
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
            checked={Boolean(formik.values.isLiked)}
            onChange={formik.handleChange}
          />
          <label className="form-check-label" htmlFor="isLiked">
            Mark as Favorite
          </label>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger flex-fill"
            type="button"
            onClick={() => {
              formik.resetForm();
              onHide();
            }}
          >
            CANCEL
          </button>
        </div>

        <button
          className="btn btn-success w-100 mt-3"
          type="submit"
          disabled={!formik.dirty || !formik.isValid}
        >
          Update Recipe
        </button>
      </form>
    </div>
  );
};

export default UpdateCard;
