"use client";
import { IoIosSettings } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import React, { ChangeEvent, Suspense, useEffect, useRef, useState } from "react";
import { CardFooter, Form, FormText, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useSession } from "next-auth/react";
import { Flashcard } from "../../../types/customTypes";
import { CldImage } from "next-cloudinary";
import "@/styles/global.css";
import styles from "./page.module.css";
import { Loader } from "@/utils/loader";
import { useRouter } from "next/navigation";
import { FaRegImage } from "react-icons/fa6";
import { GoUpload } from "react-icons/go";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";

function DisplayFlashcard() {
  const { status, data } = useSession();
  console.log("status :>> ", status);
  console.log("data :>> ", data);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [originalFlashcards, setOriginalFlashcards] = useState<
    Flashcard[] | null
  >(null);
  const [updatedFlashcard, setUpdatedFlashcard] = useState<Flashcard | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [show, setShow] = useState(false);
  const [successUpdate, setSuccessUpdate] = useState<boolean | false>(false);
  const [successDelete, setSuccessDelete] = useState<boolean | false>(false);
  const [newValue, setNewValue] = useState<string | null>(null);
    const [showClickHere, setShowClickHere] = useState(false);
    const target = useRef(null);
  const router = useRouter();
  const handleClose = () => {
    setShow(false);
    setImagePreviewUrl(null);
    setImageUploadSuccess(false);
    setUploadedImageUrl(null);
  };
  const handleShow = () => setShow(true);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getFlashcards = async () => {
    try {
      if (data?.user) {
        const requestOptions: RequestInit = {
          method: "GET",
          redirect: "follow",
        };
        const response = await fetch(
          `http://localhost:3000/api/flashcards/${data.user.id}`,
          requestOptions
        );
        const result = await response.json();
        setOriginalFlashcards(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredFlashcards = originalFlashcards?.filter((item) => {
    console.log("newValue :>> ", newValue);
    console.log(item.backside, item.level === newValue);
    if (!newValue) {
      return true;
    }
    return item.level === newValue;
  });
  console.log("filteredFlashcards :>> ", filteredFlashcards);

  const handleNext = () => {
    setShowAnswer(false);
    setShowClickHere(false);
    if (filteredFlashcards) {
      setCurrentIndex((prev) => (prev + 1) % filteredFlashcards.length);
    }
  };

  const handlePrev = () => {
    setShowAnswer(false);
    if (filteredFlashcards) {
      setCurrentIndex(
        (prev) =>
          (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length
      );
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value :>> ", e.target.value);
    setUpdatedFlashcard({
      ...updatedFlashcard!,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE FLASHCARD
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState<boolean>(false);

  const handleAttachFile = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log("e.target.files", e.target.files);
    const file = e.target.files?.[0];

    if (file instanceof File) {
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

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

  console.log("uploadedImageUrl :>> ", uploadedImageUrl);

  const submitUpdatedFlashcard = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      if (filteredFlashcards) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        const raw = JSON.stringify({
          backside: updatedFlashcard?.backside,
          frontside: updatedFlashcard?.frontside,
          ...(uploadedImageUrl && { imageUrl: uploadedImageUrl }),
        });
        const requestOptions: RequestInit = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        const response = await fetch(
          `http://localhost:3000/api/flashcards/${filteredFlashcards[currentIndex]._id}`,
          requestOptions
        );
        const result = await response.json();
        setSuccessUpdate(result.success);
        getFlashcards();
        setTimeout(() => {
          handleClose();
          setSuccessUpdate(false);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE FLASHCARD
  const submitDeleteFlashcard = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (
      !window.confirm(
        "Are you sure you want to delete this card? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      if (filteredFlashcards) {
        const requestOptions: RequestInit = {
          method: "DELETE",
          redirect: "follow",
        };
        const response = await fetch(
          `http://localhost:3000/api/flashcards/${filteredFlashcards[currentIndex]._id}`,
          requestOptions
        );
        const result = await response.json();
        setSuccessDelete(result.success);
        setTimeout(() => {
          handleClose();
          setSuccessDelete(false);
          getFlashcards();
          setCurrentIndex(0);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

// UPDATE CARDLEVEL
  const updateCardlevel = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const newValue = e.target.value;
    try {
      if (filteredFlashcards) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        const raw = JSON.stringify({
          level: newValue,
        });
        const requestOptions: RequestInit = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        const response = await fetch(
          `http://localhost:3000/api/flashcards/${filteredFlashcards[currentIndex]._id}`,
          requestOptions
        );
        const result = await response.json();
        console.log("result :>> ", result);
      }
      getFlashcards();
    } catch (error) {
      console.error(error);
    }
  };

  const [selectedFilter, setSelectedFilter] = useState<string | "">("");
  const handleFilter = (e) => {
    e.preventDefault();
    const choosenValue = e.target.value;
    setNewValue(choosenValue);
    setCurrentIndex(0);
    setSelectedFilter(choosenValue);
    console.log("e :>> ", e);
  };
  useEffect(() => {
    if (status === "authenticated" && data?.user) {
      getFlashcards();
    }
  }, [status]);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [status, router]);

useEffect(() => {
    const timer = setTimeout(() => {
      setShowClickHere(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return <Loader />;
  }

  
  return (
    <>
      <div className={styles.pageLayout}>
        <div className={styles.selectedFilter}>
          <Button
            variant="outline-secondary"
            onClick={handleFilter}
            value=""
            style={{ backgroundColor: selectedFilter === "" && "lightblue" }}
          >
            All
          </Button>
          <Button
            variant="outline-secondary"
            onClick={handleFilter}
            value="Easy"
            style={{
              backgroundColor: selectedFilter === "Easy" && "lightblue",
            }}
          >
            Easy
          </Button>
          <Button
            variant="outline-secondary"
            onClick={handleFilter}
            value="Neutral"
            style={{
              backgroundColor: selectedFilter === "Neutral" && "lightblue",
            }}
          >
            Neutral
          </Button>
          <Button
            variant="outline-secondary"
            onClick={handleFilter}
            value="Difficult"
            style={{
              backgroundColor: selectedFilter === "Difficult" && "lightblue",
            }}
          >
            Difficult
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Card style={{ width: "100%", maxWidth: "50rem", minWidth: "14rem" }}>
            {/* {console.log("currentIndex", currentIndex)} */}
            {filteredFlashcards &&
              filteredFlashcards[currentIndex]?.imageUrl && (
                <div style={{ position: "relative", height: "20rem" }}>
                  {!imageLoaded && <Loader />}
                  <Card.Img
                    as={CldImage}
                    width="500"
                    height="300"
                    src={filteredFlashcards[currentIndex].imageUrl}
                    sizes="100vw"
                    crop="fill"
                    alt="Card image"
                    onLoad={handleImageLoad}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                      opacity: imageLoaded ? 1 : 0,
                    }}
                    // loading="lazy" // Lazy load the image
                  />
                </div>
              )}

            <Card.Body onClick={() => setShowAnswer(!showAnswer)}>
              {/* <Card.Title>Card Title</Card.Title> */}
              <Card.Text ref={target}
                style={
                  filteredFlashcards &&
                  filteredFlashcards.length > 0 &&
                  !filteredFlashcards[currentIndex]?.imageUrl
                    ? {
                        minHeight: "11rem",
                        paddingTop: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        width: "100%",
                      }
                    : {}
                }
              >
                {filteredFlashcards &&
                  filteredFlashcards?.length > 0 &&
                  filteredFlashcards[currentIndex]?.frontside}
              </Card.Text>
              <Overlay target={target.current} show={showClickHere} placement="right" >
            {(props) => (
              <Tooltip id="auto-tooltip" {...props}>
                Click here!
              </Tooltip>
            )}
          </Overlay>
            </Card.Body>

            {showAnswer &&
              filteredFlashcards &&
              filteredFlashcards?.length > 0 &&
              filteredFlashcards[currentIndex] && (
                <CardFooter>
                  {filteredFlashcards[currentIndex].backside}
                </CardFooter>
              )}

            <CardFooter
              className={styles.CardLevelContainer}
              // style={{ display: "flex", justifyContent: "space-between" }}
            >
              {filteredFlashcards &&
                filteredFlashcards?.length > 0 &&
                filteredFlashcards[currentIndex]?.level === "Easy" && (
                  <>
                    <Button
                      variant="outline-secondary"
                      style={{ background: "lightblue" }}
                      disabled
                    >
                      Easy
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={updateCardlevel}
                      value="Neutral"
                    >
                      Neutral
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={updateCardlevel}
                      value="Difficult"
                    >
                      Difficult
                    </Button>
                  </>
                )}
              {filteredFlashcards &&
                filteredFlashcards?.length > 0 &&
                filteredFlashcards[currentIndex]?.level === "Neutral" && (
                  <>
                    <Button
                      variant="outline-secondary"
                      onClick={updateCardlevel}
                      value="Easy"
                    >
                      Easy
                    </Button>
                    <Button
                      variant="outline-secondary"
                      style={{ background: "lightblue" }}
                      disabled
                    >
                      Neutral
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={updateCardlevel}
                      value="Difficult"
                    >
                      Difficult
                    </Button>
                  </>
                )}
              {filteredFlashcards &&
                filteredFlashcards?.length > 0 &&
                filteredFlashcards[currentIndex]?.level === "Difficult" && (
                  <>
                    <Button
                      variant="outline-secondary"
                      onClick={updateCardlevel}
                      value="Easy"
                    >
                      Easy
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={updateCardlevel}
                      value="Neutral"
                    >
                      Neutral
                    </Button>
                    <Button
                      variant="outline-secondary"
                      style={{ background: "lightblue" }}
                      disabled
                    >
                      Difficult
                    </Button>
                  </>
                )}
            </CardFooter>
            <CardFooter
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button onClick={handlePrev} variant="outline-secondary">
                <FaArrowLeft />
              </Button>{" "}
              <Button variant="outline-secondary" onClick={handleShow}>
                <IoIosSettings />
              </Button>
              <Button onClick={handleNext} variant="outline-secondary">
                <FaArrowRight />
              </Button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Change card</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={submitUpdatedFlashcard}>
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
                        <div
                          style={{ textAlign: "center", fontSize: "smaller" }}
                        >
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

                      {imageUploadSuccess && (
                        <div>Image succesfully uploaded!</div>
                      )}
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

                    <Form.Group className="mb-3">
                      <Form.Label>Frontside</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        onChange={handleInput}
                        type="text"
                        name="frontside"
                        placeholder={
                          filteredFlashcards &&
                          filteredFlashcards?.length > 0 &&
                          filteredFlashcards[currentIndex]?.frontside
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Backside</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        onChange={handleInput}
                        type="text"
                        name="backside"
                        placeholder={
                          filteredFlashcards &&
                          filteredFlashcards?.length > 0 &&
                          filteredFlashcards[currentIndex]?.backside
                        }
                      />
                    </Form.Group>
                    {successUpdate && <FormText>Flashcard updated!</FormText>}
                    {successDelete && <FormText>Flashcard deleted!</FormText>}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button variant="outline-primary" size="sm" type="submit">
                        Save
                      </Button>
                      <Button
                        size="sm"
                        onClick={submitDeleteFlashcard}
                        variant="outline-danger"
                      >
                        Delete
                      </Button>{" "}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleClose}
                      >
                        Close
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </CardFooter>
          </Card>
        </div>{" "}
        {filteredFlashcards && filteredFlashcards?.length > 0 ? (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <i>
              Count:{currentIndex + 1}/{filteredFlashcards.length}
            </i>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <i>Count:0/0</i>
          </div>
        )}
      </div>
    </>
  );
}

export default DisplayFlashcard;
