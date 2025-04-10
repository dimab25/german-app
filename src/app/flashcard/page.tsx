"use client";
import React, { useEffect, useState } from "react";
import { CardFooter } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "@/styles/global.css";
import styles from "./page.module.css";
import CreateFlashcard from "@/components/createFlashcard";

export interface APIOkResponseFlashcards {
  success: boolean;
  data: Flashcard[];
}

export interface Flashcard {
  _id: string;
  backside: string;
  frontside: string;
  imageUrl: string;
  user_id: string;
  created_at?: string;
  updatedAt?: string;
  __v?: number;
}

function flashcard() {
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const getFlashcards = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:3000/api/flashcards/67ee55b7fcafbc953cfe0f56",
        requestOptions
      );
      const result = await response.json();
      setFlashcards(result.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log("flashcards :>> ", flashcards);

  const handleNext = () => {
    setShowAnswer(false);
    if (flashcards) {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }
  };

  const handlePrev = () => {
    setShowAnswer(false);
    if (flashcards) {
      setCurrentIndex(
        (prev) => (prev - 1 + flashcards.length) % flashcards.length
      );
    }
  };
  //   if (flashcards.length === 0) return <p>Loading...</p>;
  //   const currentCard = flashcards[currentIndex];

  useEffect(() => {
    getFlashcards();
  }, []);

  return (
    <>
    <div className={styles.backgroundDiv}>
      <Card style={{ width: "18rem" }}>
        {flashcards && flashcards[currentIndex].imageUrl.length>0 ?  <Card.Img
          variant="top"
          src={flashcards && flashcards[currentIndex].imageUrl}
        />:null}
       
        <Card.Body onClick={() => setShowAnswer(!showAnswer)}>
          {/* <Card.Title>Card Title</Card.Title> */}
          <Card.Text>
            {flashcards && flashcards[currentIndex].frontside}
          </Card.Text>
        </Card.Body>

        {showAnswer && flashcards ? (
          <CardFooter>{flashcards[currentIndex].backside}</CardFooter>
        ) : null}
        <CardFooter>
          <Button onClick={handlePrev} variant="primary">
            Privious
          </Button>
          <Button onClick={handleNext} variant="primary">
            Next
          </Button>
        </CardFooter>
      </Card>

     
      </div><CreateFlashcard/>
    </>
  );
}

export default flashcard;
