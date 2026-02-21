import { FunctionComponent } from "react";
import { Modal } from "react-bootstrap";
import DeleteCard from "./DeleteCard";

interface DeleteCardModalProps {
  show: boolean;
  onHide: () => void;
  cardId: string;
  refresh: () => void;
}
// Modal component for deleting a card
const DeleteCardModal: FunctionComponent<DeleteCardModalProps> = ({
  show,
  onHide,
  cardId,
  refresh,
}) => {
  return (
    <Modal show={show} onHide={() => onHide()}>
      <Modal.Header closeButton style={{ backgroundColor: "#5F9598" }}>
        <Modal.Title>Delete Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#5F9598" }}>
        <DeleteCard onHide={onHide} cardId={cardId} refresh={refresh} />
      </Modal.Body>
    </Modal>
  );
};

export default DeleteCardModal;
