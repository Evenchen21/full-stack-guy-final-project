import { FunctionComponent } from "react";
import { deleteCard } from "../services/RecipeService";
import { toast } from "react-toastify";

interface DeleteCardProps {
  onHide: () => void;
  cardId: string;
  refresh: () => void;
}

const DeleteCard: FunctionComponent<DeleteCardProps> = ({
  onHide,
  cardId,
  refresh,
}) => {
  // Function to handle recipe deletion
  const handleDelete = () => {
    deleteCard(cardId)
      .then(() => {
        toast.success("Recipe deleted successfully");
        onHide();
        refresh();
      })
      .catch(() => {
        toast.error("Error deleting recipe");
      });
  };

  // Delete Recipe Confirmation Dialog/Modal
  return (
    <>
      <div className="container text-center">
        <h5 className="mb-4">
          Are you sure you want to delete this recipe? 🙁
        </h5>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-secondary" onClick={() => onHide()}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Yes
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteCard;
