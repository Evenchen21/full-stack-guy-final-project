import { FunctionComponent } from "react";
import { Modal } from "react-bootstrap";
import CreateCard from "./CreateCard";

interface CreateCardModalProps {
  show: boolean;
  onHide: () => void;
  refresh: () => void;
  category?: string;
}
// Modal component for creating a new recipe card
const CreateCardModal: FunctionComponent<CreateCardModalProps> = ({
  show,
  onHide,
  refresh,
  category,
}) => {
  return (
    // Modal for creating a new recipe card
    <Modal show={show} onHide={() => onHide()} size="lg">
      <Modal.Header
        closeButton
        closeVariant="white"
        style={{
          backgroundColor: "#1D546D",
          borderBottom: "1px solid #5F9598",
        }}
      >
        <Modal.Title style={{ color: "#F3F4F4", fontWeight: 600 }}>
          {category === "Dessert" ? "Create New Dessert" : "Create New Recipe"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#061E29" }}>
        <CreateCard onHide={onHide} refresh={refresh} category={category} />
      </Modal.Body>
    </Modal>
  );
};

export default CreateCardModal;
