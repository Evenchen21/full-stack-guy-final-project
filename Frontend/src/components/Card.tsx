import { FunctionComponent, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import CardInterface from "../interfaces/RecipesCard";
import { getAllCards } from "../services/RecipeService";
import NavBar from "./navBar";

interface CardProps {}

const Cart: FunctionComponent<CardProps> = () => {
  // Holds the list of recipe cards fetched from the server //
  const [cards, setCards] = useState<CardInterface[]>([]);

  // Fetch all cards once when the component first mounts //
  useEffect(() => {
    getAllCards()
      .then((res: any) => {
        // Handle both flat array and nested { cards: [] } response shapes //
        const cardsData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.cards)
            ? res.data.cards
            : [];

        // Normalize each item to a consistent shape regardless of API differences //
        const normalizedCards: CardInterface[] = cardsData.map((item: any) => ({
          _id: item._id,
          id: item.id,
          title: item.title || "Untitled",
          description: item.description || "",
          imageUrl: item.imageUrl || item.image?.url || "",
          isLiked: item.isLiked,
        }));

        setCards(normalizedCards);
      })
      .catch(() => {
        // On any error just render an empty list so the page doesn't crash //
        setCards([]);
      });
  }, []);

  return (
    <>
      <NavBar />
      <div className="container">
        <h4 className="display-4 text-center my-4">My Recipe</h4>
        {cards.length ? (
          <div className="row">
            {cards.map((cardItem: CardInterface) => (
              <div
                className="col-md-4 mb-4"
                // Use _id if available, fall back to id for older API responses //
                key={String(cardItem._id || cardItem.id)}
              >
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
                    <i
                      className="fa-solid fa-heart text-muted"
                      style={{ fontSize: "1.4rem" }}
                    ></i>
                    <i
                      className="fa-regular fa-pen-to-square text-muted"
                      style={{ fontSize: "1.4rem" }}
                    ></i>
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Server Error..</p>
        )}
      </div>
    </>
  );
};

export default Cart;
