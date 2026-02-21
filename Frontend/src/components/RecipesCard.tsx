import { FunctionComponent, useCallback, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import CreateCardModal from "./CreateCardModal";
import DeleteCardModal from "./DeleteCardModal";
import UpdateCardModal from "./UpdateCardModal";
import { toast } from "react-toastify";
import { getAllCards, updateCard } from "../services/RecipeService";
import { useAuth } from "../context/AuthContext";

interface RecipesCardProps {}

interface CardInterface {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  isLiked?: boolean;
}

const RecipesCard: FunctionComponent<RecipesCardProps> = () => {
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [selectedUpdateCardId, setSelectedUpdateCardId] = useState<string>("");
  const { isLoggedIn } = useAuth();

  const getCards = useCallback(async () => {
    try {
      const res = await getAllCards();
      const cardsData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.cards)
          ? res.data.cards
          : [];

      const normalizedCards: CardInterface[] = cardsData.map((item: any) => ({
        _id: String(item._id || item.id),
        title: item.title || "Untitled",
        description: item.description || "",
        imageUrl: item.imageUrl || item.image?.url || "",
        isLiked: item.isLiked,
      }));

      setCards(normalizedCards);
    } catch (err: any) {
      console.error(
        "Cards fetch error:",
        err?.message,
        err?.response?.status,
        err?.config?.url,
      );
      setCards([]);
    }
  }, []);

  useEffect(() => {
    getCards();
  }, [getCards]);

  const openDeleteModal = (cardId: string) => {
    setSelectedCardId(cardId);
    setShowDeleteModal(true);
  };

  const openUpdateModal = (cardId: string) => {
    setSelectedUpdateCardId(cardId);
    setShowUpdateModal(true);
  };

  const toggleLike = async (cardId: string) => {
    let updatedCard: CardInterface | undefined;
    let previousCards: CardInterface[] = [];

    setCards((prev) => {
      previousCards = prev;
      return prev.map((card) => {
        if (card._id !== cardId) return card;
        updatedCard = { ...card, isLiked: !card.isLiked };
        return updatedCard;
      });
    });

    if (!updatedCard) return;

    try {
      await updateCard(cardId, {
        title: updatedCard.title,
        description: updatedCard.description,
        imageUrl: updatedCard.imageUrl,
        isLiked: updatedCard.isLiked,
      });
      toast.success(
        updatedCard.isLiked
          ? "Added to favorites ❤️"
          : "Removed from favorites",
      );
    } catch (err: any) {
      // Revert optimistic update on failure
      setCards(previousCards);
      if (err?.isAuthError) {
        toast.error("You must be logged in to like a recipe.");
        return;
      }
      console.error("Like error:", err?.response?.status, err?.message);
      toast.error(
        `Failed to update like status. ${err?.response?.status ? `(${err.response.status})` : ""}`,
      );
    }
  };

  return (
    <>
      <div className="container">
        <h4 className="display-4 text-center my-4" style={{ color: "#ffffff" }}>
          Yumm... Recipes 🍔
        </h4>
        {cards.length ? (
          <div className="row">
            {cards.map((cardItem: CardInterface) => (
              <div className="col-md-4 mb-4 px-3" key={cardItem._id}>
                <Card className="h-100 shadow">
                  <Card.Img
                    variant="top"
                    src={cardItem.imageUrl}
                    alt={cardItem.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{cardItem.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {cardItem.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0 d-flex justify-content-end align-items-center gap-3">
                    {isLoggedIn ? (
                      <>
                        <i
                          className={
                            cardItem.isLiked
                              ? "fa-solid fa-heart text-danger"
                              : "fa-regular fa-heart text-muted"
                          }
                          style={{ fontSize: "1.4rem", cursor: "pointer" }}
                          onClick={() => toggleLike(cardItem._id)}
                        ></i>
                        <i
                          className="fa-regular fa-pen-to-square text-muted"
                          style={{ fontSize: "1.4rem", cursor: "pointer" }}
                          onClick={() => openUpdateModal(cardItem._id)}
                        ></i>
                        <i
                          className="fa-solid fa-trash text-danger"
                          style={{ fontSize: "1.5rem", cursor: "pointer" }}
                          onClick={() => openDeleteModal(cardItem._id)}
                        ></i>
                      </>
                    ) : null}
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No cards info Error</p>
        )}
      </div>

      <CreateCardModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        refresh={getCards}
      />

      <DeleteCardModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        cardId={selectedCardId}
        refresh={getCards}
      />

      <UpdateCardModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        cardId={selectedUpdateCardId}
        refresh={getCards}
      />
    </>
  );
};

export default RecipesCard;
