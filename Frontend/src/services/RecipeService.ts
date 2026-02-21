import axios from "./axios";
import Card from "../interfaces/RecipesCard";

const api: string =
  process.env.REACT_APP_API_CARDS || "http://localhost:9000/api/cards";

// get all cards //
export function getAllCards() {
  return axios.get(api);
}

// get card by id //
export function getCardById(cardId: string) {
  return axios.get(`${api}/${cardId}`);
}

// add card //
export function addCard(newCard: Card) {
  return axios.post(api, newCard);
}

// update card //
export function updateCard(cardId: string, updatedCard: Card) {
  return axios.put(`${api}/${cardId}`, updatedCard);
}

// delete card //
export function deleteCard(cardId: string) {
  return axios.delete(`${api}/${cardId}`);
}
