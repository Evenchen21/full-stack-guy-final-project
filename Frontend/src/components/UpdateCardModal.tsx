import { FunctionComponent } from "react";
import { Modal } from "react-bootstrap";
import UpdateCard from "./UpdateCard";

interface UpdateCardModalProps {
  show: boolean;
  onHide: () => void;
  cardId: string;
  refresh: () => void;
}

const UpdateCardModal: FunctionComponent<UpdateCardModalProps> = ({
  show,
  onHide,
  cardId,
  refresh,
}) => {
  return (
    <Modal show={show} onHide={() => onHide()} size="lg">
      <Modal.Header closeButton style={{ backgroundColor: "#5F9598" }}>
        <Modal.Title>Update Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#5F9598" }}>
        <UpdateCard onHide={onHide} cardId={cardId} refresh={refresh} />
      </Modal.Body>
    </Modal>
  );
};

export default UpdateCardModal;
