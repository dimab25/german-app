"use client";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Flashcard } from "../../types/customTypes";

function CreateFlashcard() {
  const [newFlashcard, setNewFlashcard] = useState<Flashcard | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value :>> ", e.target.value);
    setNewFlashcard({ ...newFlashcard!, [e.target.name]: e.target.value });
  };

  const submitNewFlashcard = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      const raw = JSON.stringify({
        backside: newFlashcard?.backside,
        frontside: newFlashcard?.frontside,
        imageUrl: "",
        user_id: "67ee55b7fcafbc953cfe0f56",
      });

      const requestOptions: RequestInit  = {
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
        setSuccess(false)
      }, 1000);
      ;
      console.log("result :>> ", result);
    } catch (error) {
      console.error(error);
    }
  };
  console.log("newFlashcard :>> ", newFlashcard);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create new Flashcard
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a new Flashcard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitNewFlashcard}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Frontside</Form.Label>
              <Form.Control
              as="textarea" rows={1} 
                onChange={handleInput}
                type="text"
                name="frontside"
                placeholder=""
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Backside</Form.Label>
              <Form.Control
              as="textarea" rows={1} 
                onChange={handleInput}
                type="text"
                name="backside"
                placeholder=""
              />
            </Form.Group>
            <Button type="submit">Create</Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Form>
          {success && <div>New flashcard created!</div>}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateFlashcard;
