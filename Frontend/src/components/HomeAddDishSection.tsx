import { FunctionComponent, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CreateCardModal from "./CreateCardModal";

interface HomeAddDishSectionProps {
  onDishAdded: () => void;
}

const HomeAddDishSection: FunctionComponent<HomeAddDishSectionProps> = ({
  onDishAdded,
}) => {
  const { isLoggedIn } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <section className="container py-4">
      <div
        className="p-4 rounded-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
        style={{
          backgroundColor: "#061E29",
          border: "1px solid #1D546D",
        }}
      >
        <div>
          <h3 className="mb-2" style={{ color: "#F3F4F4" }}>
            Add your dish to the main recipes
          </h3>
          <p className="mb-0" style={{ color: "#5F9598" }}>
            Share your Italian, American, Israeli, or any favorite dish.
          </p>
        </div>

        {isLoggedIn ? (
          <button
            className="btn"
            style={{
              backgroundColor: "#1D546D",
              borderColor: "#1D546D",
              color: "#F3F4F4",
            }}
            onClick={() => setShowCreateModal(true)}
          >
            + Add New Dish
          </button>
        ) : (
          <span style={{ color: "#F3F4F4" }}>Login to add a dish</span>
        )}
      </div>

      <CreateCardModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        refresh={onDishAdded}
      />
    </section>
  );
};

export default HomeAddDishSection;
