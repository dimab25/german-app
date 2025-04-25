import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import "../styles/TooltipModal.css";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";

type TooltipModalProps = {
  selectedText: string;
  geminiDefinition: string;
  show: boolean;
  onHide: () => void;
};

function TooltipModal({
  selectedText,
  geminiDefinition,
  show,
  onHide,
}: TooltipModalProps) {
  const { data } = useSession();
  const userId = data?.user?.id;

  const [formData, setFormData] = useState({
    frontside: "",
    backside: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    onHide();
    setFormData({ frontside: "", backside: "" });
  };

  const submitNewFlashcard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.frontside || !formData.backside) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frontside: formData.frontside,
          backside: formData.backside,
          level: "Difficult",
          user_id: userId,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error("Couldn't create flashcard. Please try again!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      toast.success("Flashcard created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (error) {
      console.error("Error submitting flashcard:", error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (show && selectedText && geminiDefinition) {
      // when the modal opens it copies the two var into a local state: formData, so that it won't be connected to any future changes in those 2 variables
      setFormData({
        frontside: selectedText,
        backside: geminiDefinition,
      });
    }
  }, [selectedText, geminiDefinition, show]);

  return (
    <div>
      <Modal
        backdropClassName="blur-backdrop"
        show={show}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>
            Do you want to create a new flashcard?
          </Modal.Title>
        </Modal.Header>

        <Form style={{ padding: "20px" }} onSubmit={submitNewFlashcard}>
          <Form.Group className="mb-3">
            <Form.Label>Frontside</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData.frontside}
              onChange={handleInputChange}
              name="frontside"
              placeholder="Frontside (e.g. word or phrase)"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Backside</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.backside}
              onChange={handleInputChange}
              name="backside"
              placeholder="Backside (definition or explanation)"
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
