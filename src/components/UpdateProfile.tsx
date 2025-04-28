"use client";
import React, { ChangeEvent, useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";
import { User } from "../../types/customTypes";
import { FaRegImage } from "react-icons/fa6";
import { GoUpload } from "react-icons/go";

import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";

type UpdateProfileProps = {
  refresh: () => void; 
};

function UpdateProfile({refresh}:UpdateProfileProps) {
  const { status, data } = useSession();
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setImagePreviewUrl(null);
    setImageUploadSuccess(false);
    setUploadedImageUrl(null);
  };
  const handleShow = () => setShow(true);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value :>> ", e.target.value);
    setUpdatedUser({ ...updatedUser!, [e.target.name]: e.target.value });
  };

  const handleAttachFile = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log("e.target.files", e.target.files);
    const file = e.target.files?.[0];

    if (file instanceof File) {
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };
  // console.log("selectedFile :>> ", selectedFile);
  // console.log("imagePreviewUrl :>> ", imagePreviewUrl);

  const handleIconClick = () => {
    document.getElementById("fileUploadInput")?.click();
  };

  const handleImageUpload = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const formdata = new FormData();

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
      setImagePreviewUrl(null);
      console.log("result image upload :>> ", result);
    } catch (error) {
      console.error(error);
    }
  };

  const submitUpdatedUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (data?.user?.id) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        const raw = JSON.stringify({
          name: updatedUser?.name,
          ...(uploadedImageUrl && { image: uploadedImageUrl }),
        });

        const requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        const response = await fetch(
          `http://localhost:3000/api/users/${data.user.id}`,
          requestOptions
        );
        const result = await response.json();

        setSuccess(result.success);
        refresh();
        setTimeout(() => {
          handleClose();
          setSuccess(false);
        }, 1000);
        console.log("result :>> ", result);

      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log("updatedUser :>> ", updatedUser);

  return (
    <>
      <Button size="sm" variant="outline-secondary" onClick={handleShow}>
        Update
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitUpdatedUser}>
            <Form.Group className="mb-3">
              <Form.Control
                type="file"
                name="image"
                id="fileUploadInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAttachFile}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "0.5rem",
                  fontSize: "30px",
                }}
              >
                <div>
                  {!imageUploadSuccess && (
                    <Button
                      variant="outline-secondary"
                      onClick={handleIconClick}
                    >
                      <FaRegImage size={40} />
                    </Button>
                  )}
                </div>
                {imagePreviewUrl && (
                  <div>
                    <Button
                      variant="outline-secondary"
                      onClick={handleImageUpload}
                    >
                      <GoUpload size={40} />
                    </Button>
                  </div>
                )}{" "}
              </div>
              {imagePreviewUrl && (
                <div style={{ textAlign: "center", fontSize: "smaller" }}>
                  This is just a image preview, please upload the file!
                </div>
              )}
              {imagePreviewUrl && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "0.5rem",
                  }}
                >
                  <CldImage
                    src={imagePreviewUrl}
                    width={200}
                    height={200}
                    crop="fill"
                    alt="uploaded image"
                  />
                </div>
              )}

              {imageUploadSuccess && <div>Image succesfully uploaded!</div>}
              {uploadedImageUrl && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "0.5rem",
                  }}
                >
                  <CldImage
                    src={uploadedImageUrl}
                    width={240}
                    height={200}
                    crop="fill"
                    alt="uploaded image"
                  />
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                onChange={handleInput}
                type="text"
                name="name"
                placeholder=""
              />
            </Form.Group>

            {imagePreviewUrl ? (
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            ) : (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button size="sm" variant="outline-primary" type="submit">
                  Update
                </Button>
                <Button size="sm" variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </div>
            )}
          </Form>
          {success && <div>User succesfully updated!</div>}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UpdateProfile;
