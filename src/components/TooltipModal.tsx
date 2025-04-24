import { use, useEffect, useRef, useState } from "react";
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
  console.log("%c flashcard modal running", "color:orange");
  const [formData, setFormData] = useState({
    frontside: selectedText,
    backside: geminiDefinition,
  });
  const frontsideTest = useRef(selectedText);
  const backsideTest = useRef(geminiDefinition);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData!, [e.target.name]: e.target.value });
  };

  const handleCloseModal = () => {
    onHide();
    setFormData({ frontside: "", backside: "" });
  };

  const submitNewFlashcard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.backside || !frontsideTest.current) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      const raw = JSON.stringify({
        backside: formData?.backside,
        frontside: frontsideTest.current,
        level: "Difficult",
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
        setFormData({ frontside: "", backside: "" });

        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("frontsideTest :>> ", frontsideTest.current);
    console.log("selectedText :>> ", selectedText);

    if (show) {
      setFormData({
        frontside: selectedText,
        backside: geminiDefinition,
      });
    }
  }, [frontsideTest.current, geminiDefinition, show]);

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
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Frontside</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              value={frontsideTest.current}
              onChange={handleInputChange}
              type="text"
              name="frontside"
              placeholder={frontsideTest.current}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Backside</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              value={formData.backside}
              onChange={handleInputChange}
              type="text"
              name="backside"
              placeholder={geminiDefinition}
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
