import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../styles/TooltipModal.css";
import { IoIosSettings } from "react-icons/io";
import { Form } from "react-bootstrap";
import { Flashcard } from "../../types/customTypes";

type TooltipModalProps = {
  selectedText: string;
};

function TooltipModal({ selectedText }: TooltipModalProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [newFlashcard, setNewFlashcard] = useState<Flashcard | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value :>> ", e.target.value);
    setNewFlashcard({ ...newFlashcard!, [e.target.name]: e.target.value });
  };

  const submitNewFlashcard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      const raw = JSON.stringify({
        backside: newFlashcard?.backside,
        frontside: newFlashcard?.frontside,
        level: "Difficult",
      });

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        "http://localhost:3000/api/flashcards",
        requestOptions
      );
      const result = await response.json();
      setSuccess(result.success);
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1000);
      console.log("result :>> ", result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="popover-button">
        <IoIosSettings />
      </Button>

      <Modal backdropClassName="blur-backdrop" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Do you want to create a new flashcard?</Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitNewFlashcard}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Frontside</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              onChange={handleInput}
              type="text"
              name="frontside"
              placeholder={selectedText}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Backside</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              onChange={handleInput}
              type="text"
              name="backside"
              placeholder=""
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit">Create</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default TooltipModal;
