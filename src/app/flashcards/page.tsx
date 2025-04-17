"use client";
import useFetchHook from "@/hooks/useFetchHook";
import React from "react";
import { Button, Card } from "react-bootstrap";
import "@/styles/global.css";
import styles from "./page.module.css";
import { APIOkResponseFlashcards } from "../../../types/customTypes";
import Link from "next/link";

function Flashcardspage() {
  const { data: BeginnerDeck } = useFetchHook<APIOkResponseFlashcards>(
    "http://localhost:3000/api/flashcards/Beginner"
  );

  const { data: IntermediateDeck } = useFetchHook<APIOkResponseFlashcards>(
    "http://localhost:3000/api/flashcards/Intermediate"
  );
  const { data: AdvancedDeck } = useFetchHook<APIOkResponseFlashcards>(
    "http://localhost:3000/api/flashcards/Advanced"
  );
  console.log("dataBeginner :>> ", BeginnerDeck);
  console.log("IntermediateDeck :>> ", IntermediateDeck);
  console.log("AdvancedDeck :>> ", AdvancedDeck);
  return (
    <>
      <div className={styles.backgroundDiv}>
        
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
            <Link href={`/flashcardDetails/Beginner`}>
              <Card.Title>Beginner</Card.Title></Link>
              <Card.Text>
                Deckcount:
                {BeginnerDeck && BeginnerDeck.data.length}
              </Card.Text>
              <Button variant="primary">View Deck</Button>
            </Card.Body>
          </Card>

          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
            <Link href={`/flashcardDetails/Intermediate`}>
              <Card.Title>Intermediate</Card.Title></Link>
              <Card.Text>
                Deckcount:
                {IntermediateDeck && IntermediateDeck.data.length}
              </Card.Text>
              <Button variant="primary">View Deck</Button>
            </Card.Body>
          </Card>

          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
            <Link href={`/flashcardDetails/Advanced`}>
              <Card.Title>Advanced</Card.Title></Link>
              <Card.Text>
                Deckcount:
                {AdvancedDeck && AdvancedDeck.data.length}
              </Card.Text>
              <Button variant="primary">View Deck</Button>
            </Card.Body>
          </Card>

          {/* <p>{BeginnerDeck && BeginnerDeck.data[0].frontside}</p> */}
        
      </div>
      <div className={styles.backgroundDiv}>
     
      </div>
   
    </>
  );
}

export default Flashcardspage;
