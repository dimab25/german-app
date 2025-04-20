import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../styles/TooltipModal.css";
import { IoIosSettings } from "react-icons/io";

function TooltipModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="popover-button">
        <IoIosSettings />
      </Button>

      <Modal backdropClassName="blur-backdrop" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Do you want to create a new flashcard?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TooltipModal;
