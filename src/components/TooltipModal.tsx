import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../styles/TooltipModal.css";
import { IoIosSettings } from "react-icons/io";
import { Form } from "react-bootstrap";
import { Flashcard } from "../../types/customTypes";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";

type TooltipModalProps = {
  selectedText: string;
  show: boolean;
  onHide: () => void;
};

function TooltipModal({ selectedText, show, onHide }: TooltipModalProps) {
  const [newFlashcard, setNewFlashcard] = useState<Flashcard | null>(null);
  const { data } = useSession();
  const userId = data?.user?.id;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        user_id: userId,
      });

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      const response = await fetch(
        "http://localhost:3000/api/flashcards",
        requestOptions
      );
      const result = await response.json();

      console.log("result :>> ", result);

      if (!result.success) {
        console.log("Couldn't create flashcard");
        toast.error("Couldn't create flashcard. Please try again!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      if (result.success) {
        toast.success("Flashcard created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          onHide();
        }, 1000);

        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Modal backdropClassName="blur-backdrop" show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>
            Do you want to create a new flashcard?
          </Modal.Title>
        </Modal.Header>
        <Form style={{ padding: "20px" }} onSubmit={submitNewFlashcard}>
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
              placeholder="Translation in your language, notes, etc."
            />
          </Form.Group>

          <div className="modal-button-container">
            <Button type="submit">Create</Button>
          </div>
        </Form>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default TooltipModal;
