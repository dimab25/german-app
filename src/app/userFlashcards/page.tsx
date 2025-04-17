"use client";
import { IoIosSettings } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { CardFooter, Form, FormText, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "@/styles/global.css";
import { useSession } from "next-auth/react";
import { Flashcard } from "../../../types/customTypes";
import { CldImage } from "next-cloudinary";
import "@/styles/global.css";
import styles from "./page.module.css";
import { disable } from "colors";

function DisplayFlashcard() {
  const { status, data } = useSession();
  console.log("status :>> ", status);
  console.log("data :>> ", data);

  // const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [originalFlashcards, setOriginalFlashcards] = useState<Flashcard[] | null>(null);
  const [updatedFlashcard, setUpdatedFlashcard] = useState<Flashcard | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [show, setShow] = useState(false);
  const [successUpdate, setSuccessUpdate] = useState<boolean | false>(false);
  const [successDelete, setSuccessDelete] = useState<boolean | false>(false);
  const [newValue, setNewValue] = useState<string|null>(null)


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getFlashcards = async () => {
    try {
      const requestOptions: RequestInit = {
        method: "GET",
        redirect: "follow",
      };
      const response = await fetch(
        "http://localhost:3000/api/flashcards/67ee55b7fcafbc953cfe0f56",
        requestOptions
      );
      const result = await response.json();
      setOriginalFlashcards(result.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const filteredFlashcards = originalFlashcards?.filter(
    (item) => {
        console.log('newValue :>> ', newValue);
        console.log(item.backside, item.level === newValue);
        if(!newValue) {
            return true
        }
        return item.level === newValue; }
  );
  console.log('filteredFlashcards :>> ', filteredFlashcards);


  const handleNext = () => {
    setShowAnswer(false);
    if (filteredFlashcards) {
      setCurrentIndex((prev) => (prev + 1) % filteredFlashcards.length);
    }
  };

 
  const handlePrev = () => {
    setShowAnswer(false);
    if (filteredFlashcards) {
      setCurrentIndex(
        (prev) => (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length
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
  //   if (flashcards.length === 0) return <p>Loading...</p>;
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
  const submitDeleteFlashcard = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (
      !window.confirm(
        "Are you sure you want to delete this card? This action cannot be undone."
      )
    ) {
      return; // Stop execution if the user cancels
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

const [selectedFilter, setSelectedFilter] = useState<string|"">("")
  const handleFilter = (e) => {
    e.preventDefault();
       const choosenValue = e.target.value;
   setNewValue(choosenValue)
   setCurrentIndex(0);
   setSelectedFilter(choosenValue)
console.log('e :>> ', e);
    };
  useEffect(() => {
    
    getFlashcards();
  }, []);

  return (
    <>
    {/* {console.log('filteredFlashcards :>> ', filteredFlashcards)} */}
      <div className={styles.selectedFilter}>
        <Button variant="outline-secondary" onClick={handleFilter} value=""  style={{ backgroundColor:  selectedFilter === '' && 'lightblue'  }} >
          All
        </Button>
        <Button variant="outline-secondary" onClick={handleFilter} value="Easy" style={{ backgroundColor: selectedFilter === 'Easy' && 'lightblue' }}  >
          Easy
        </Button>
        <Button variant="outline-secondary" onClick={handleFilter} value="Neutral" style={{ backgroundColor: selectedFilter === 'Neutral' && 'lightblue' }} >
          Neutral
        </Button>
        <Button variant="outline-secondary" onClick={handleFilter} value="Difficult" style={{ backgroundColor: selectedFilter === 'Difficult' && 'lightblue' }} >
          Difficult
        </Button>
      </div>
       {filteredFlashcards&& filteredFlashcards?.length> 0 && <p>Count:{currentIndex+1}/{filteredFlashcards.length}</p>}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card style={{ maxWidth: "50rem" }}>
            {/* {console.log("currentIndex", currentIndex)} */}
        { filteredFlashcards && filteredFlashcards?.length> 0 ? (
            <Card.Img
              as={CldImage}
              width="500"
              height="400"
              src={filteredFlashcards[currentIndex].imageUrl}
              sizes="100vw"
              crop="fill"
              alt="Description of my image"

            />
          ) : <h1 style={{padding:"1rem"}}>Empty Deck</h1>}
          {/* {flashcards && flashcards[currentIndex].imageUrl.length > 0 ? (
            <Card.Img
              as={CldImage}
              width="500"
              height="400"
              src={flashcards[currentIndex].imageUrl}
              sizes="100vw"
              crop="fill"
              alt="Description of my image"
            />
          ) : null} */}

          <Card.Body onClick={() => setShowAnswer(!showAnswer)}>
            {/* <Card.Title>Card Title</Card.Title> */}
            <Card.Text>
              {filteredFlashcards && filteredFlashcards?.length> 0 && filteredFlashcards[currentIndex].frontside}
            </Card.Text>
          </Card.Body>

          {showAnswer && filteredFlashcards&& filteredFlashcards?.length> 0 && (
            <CardFooter>{filteredFlashcards[currentIndex].backside}</CardFooter>
          ) }

          <CardFooter
            className={styles.CardLevelContainer}
            // style={{ display: "flex", justifyContent: "space-between" }}
          >
            {filteredFlashcards && filteredFlashcards?.length> 0 &&  filteredFlashcards[currentIndex].level === "Easy" && (
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
            {filteredFlashcards && filteredFlashcards?.length> 0 &&  filteredFlashcards[currentIndex].level === "Neutral" && (
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
            {filteredFlashcards && filteredFlashcards?.length> 0 &&  filteredFlashcards[currentIndex].level === "Difficult" && (
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
                    <Form.Label>Frontside</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      onChange={handleInput}
                      type="text"
                      name="frontside"
                      placeholder={
                        filteredFlashcards&& filteredFlashcards?.length> 0 && filteredFlashcards[currentIndex].frontside
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
                        filteredFlashcards && filteredFlashcards?.length> 0 && filteredFlashcards[currentIndex].backside
                      }
                    />
                  </Form.Group>
                  {successUpdate && <FormText>Flashcard updated!</FormText>}
                  {successDelete && <FormText>Flashcard deleted!</FormText>}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button type="submit">Save</Button>
                    <Button onClick={submitDeleteFlashcard} variant="danger">
                      Delete
                    </Button>{" "}
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default DisplayFlashcard;
