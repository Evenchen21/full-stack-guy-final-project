import { FunctionComponent, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import RecipesCard from "../interfaces/RecipesCard";
import { getAllCards, deleteCard, updateCard } from "../services/RecipeService";
import { toast } from "react-toastify";
import CreateCardModal from "./CreateCardModal";

interface HeaderPageDesertsProps {}

const HeaderPageDeserts: FunctionComponent<HeaderPageDesertsProps> = () => {
  const { isLoggedIn } = useAuth();
  const [desserts, setDesserts] = useState<RecipesCard[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDessert, setEditingDessert] = useState<RecipesCard | null>(
    null,
  );

  const fetchDesserts = async () => {
    try {
      const result = await getAllCards();
      const allCards: RecipesCard[] = result.data;
      // Filter for desserts
      const dessertCards = allCards.filter(
        (card) => card.category === "Dessert",
      );
      setDesserts(dessertCards);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load desserts");
    }
  };

  useEffect(() => {
    fetchDesserts();
  }, []);

  const handleRemoveDessert = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this dessert?")) {
      try {
        await deleteCard(id);
        toast.success("Dessert deleted");
        fetchDesserts();
      } catch (err) {
        toast.error("Failed to delete dessert");
      }
    }
  };

  const handleToggleLike = async (card: RecipesCard) => {
    if (!card._id) return;
    try {
      await updateCard(card._id, { ...card, isLiked: !card.isLiked });
      fetchDesserts();
    } catch (err) {
      toast.error("Failed to update like status");
    }
  };

  const startEdit = (card: RecipesCard) => {
    if (!card._id) return;
    setEditingId(card._id);
    setEditingDessert(card);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingDessert(null);
  };

  const saveEdit = async () => {
    if (!editingDessert || !editingDessert._id) return;
    try {
      await updateCard(editingDessert._id, editingDessert);
      toast.success("Dessert updated");
      setEditingId(null);
      setEditingDessert(null);
      fetchDesserts();
    } catch (err) {
      toast.error("Failed to update dessert");
    }
  };

  return (
    <section className="container py-4">
      <h4 className="display-6 text-center mb-4" style={{ color: "#5F9598" }}>
        Sweet Desserts 🍰
      </h4>

      {isLoggedIn && (
        <div
          className="p-4 rounded-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
          style={{
            backgroundColor: "#061E29",
            border: "1px solid #1D546D",
          }}
        >
          <div>
            <h3 className="mb-2" style={{ color: "#F3F4F4" }}>
              Add your favorite dessert
            </h3>
            <p className="mb-0" style={{ color: "#5F9598" }}>
              Share your best sweet treats.
            </p>
          </div>
          <button
            className="btn"
            style={{
              backgroundColor: "#1D546D",
              borderColor: "#1D546D",
              color: "#F3F4F4",
            }}
            onClick={() => setShowCreateModal(true)}
          >
            + Add New Dessert
          </button>
        </div>
      )}

      <CreateCardModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        refresh={fetchDesserts}
        category="Dessert"
      />

      <div className="row">
        {desserts.map((dessert) => (
          <div className="col-md-4 mb-4" key={dessert._id}>
            <div
              className="card h-100 shadow"
              style={{
                backgroundColor: "#05090d",
                border: "1px solid #1D546D",
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              {editingId === dessert._id && editingDessert ? (
                <div className="p-3">
                  <input
                    className="form-control mb-2"
                    value={editingDessert.title}
                    onChange={(e) =>
                      setEditingDessert({
                        ...editingDessert,
                        title: e.target.value,
                      })
                    }
                    placeholder="Dessert title"
                  />
                  <input
                    className="form-control mb-2"
                    value={editingDessert.description}
                    onChange={(e) =>
                      setEditingDessert({
                        ...editingDessert,
                        description: e.target.value,
                      })
                    }
                    placeholder="Dessert description"
                  />
                  <input
                    className="form-control mb-3"
                    value={editingDessert.imageUrl}
                    onChange={(e) =>
                      setEditingDessert({
                        ...editingDessert,
                        imageUrl: e.target.value,
                      })
                    }
                    placeholder="Image URL"
                  />
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#1D546D", color: "#F3F4F4" }}
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={dessert.imageUrl}
                    className="card-img-top"
                    alt={dessert.title}
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  <div
                    className="card-body text-center"
                    style={{
                      background:
                        "linear-gradient(180deg, #07131C 0%, #05090D 100%)",
                    }}
                  >
                    <h5
                      className="card-title"
                      style={{ color: "#D7D7D7", fontSize: "2rem" }}
                    >
                      {dessert.title}
                    </h5>
                    <p
                      className="card-text px-2"
                      style={{ color: "#A8A8A8", fontSize: "1rem" }}
                    >
                      {dessert.description}
                    </p>
                  </div>
                  {isLoggedIn && (
                    <div
                      className="card-footer border-0 d-flex justify-content-end align-items-center gap-3 px-4 pb-3"
                      style={{
                        background:
                          "linear-gradient(180deg, #07131C 0%, #05090D 100%)",
                      }}
                    >
                      <i
                        className={
                          dessert.isLiked
                            ? "fa-solid fa-heart text-danger"
                            : "fa-regular fa-heart"
                        }
                        style={{
                          color: dessert.isLiked ? undefined : "#b6b6b6",
                          fontSize: "2rem",
                          cursor: "pointer",
                        }}
                        onClick={() => handleToggleLike(dessert)}
                      ></i>

                      <i
                        className="fa-regular fa-pen-to-square"
                        style={{
                          color: "#b6b6b6",
                          fontSize: "2rem",
                          cursor: "pointer",
                        }}
                        onClick={() => startEdit(dessert)}
                      ></i>

                      <i
                        className="fa-solid fa-trash"
                        style={{
                          color: "#E84C63",
                          fontSize: "2rem",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          dessert._id && handleRemoveDessert(dessert._id)
                        }
                      ></i>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeaderPageDeserts;
