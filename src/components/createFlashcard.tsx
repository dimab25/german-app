"use client";
import React, { ChangeEvent, useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";
import { Flashcard } from "../../types/customTypes";
import { FaRegImage } from "react-icons/fa6";
import { DiVim } from "react-icons/di";

function CreateFlashcard() {
  const [newFlashcard, setNewFlashcard] = useState<Flashcard | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setImagePreviewUrl(null);
  };
  const handleShow = () => setShow(true);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value :>> ", e.target.value);
    setNewFlashcard({ ...newFlashcard!, [e.target.name]: e.target.value });
  };

  const handleAttachFile = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log("e.target.files", e.target.files);
    const file = e.target.files?.[0];

    if (file instanceof File) {
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };
  console.log("selectedFile :>> ", selectedFile);
  console.log("imagePreviewUrl :>> ", imagePreviewUrl);

  const handleIconClick = () => {
    document.getElementById("fileUploadInput")?.click();
  };

  const handleImageUpload = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const formdata = new FormData();
      // formdata.append("file", fileInput.files[0], "dwarf-planets.webp");
      formdata.append("file", selectedFile);
      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
      const response = await fetch(
        "http://localhost:3000/api/upload",
        requestOptions
      );
      const result = await response.json();
      setImageUploadSuccess(result.success);
      setUploadedImageUrl(result.imgUrl);
      console.log("result image upload :>> ", result);
    } catch (error) {
      console.error(error);
    }
  };

  const submitNewFlashcard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      const raw = JSON.stringify({
        backside: newFlashcard?.backside,
        frontside: newFlashcard?.frontside,
level:"Difficult",
...(uploadedImageUrl && { imageUrl: uploadedImageUrl }),
        user_id: "67ee55b7fcafbc953cfe0f56",
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
            <Form.Group className="mb-3">
              {/* <Form.Label>
                                
                          </Form.Label> */}

              <Form.Control
                type="file"
                name="image"
                id="fileUploadInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAttachFile}
              />
              
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Button variant="outline-secondary" onClick={handleIconClick}>
                <FaRegImage size={40} />
              </Button>
                {imagePreviewUrl && (
                  <Button onClick={handleImageUpload}>Upload</Button>
                )}

                {imageUploadSuccess && <div>Image succesfully uploaded!</div>}
              </div>
              {imagePreviewUrl && <Image src={imagePreviewUrl} width={100} />}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Frontside</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                onChange={handleInput}
                type="text"
                name="frontside"
                placeholder=""
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
