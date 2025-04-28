"use client";
import useFetchHook from "@/hooks/useFetchHook";
import React from "react";
import { Button, Card, CardHeader } from "react-bootstrap";
import "@/styles/global.css";
import styles from "./page.module.css";
import { APIOkResponseFlashcards } from "../../../types/customTypes";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

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
        <Card style={{ width: "24rem" }}>
          <CardHeader className={styles.cardHeader}>Beginner</CardHeader>
          <CardHeader>
            <div className={styles.previewDeck}>
              {BeginnerDeck &&
                BeginnerDeck.data
                  .slice(0, 5)
                  .map((item, index) => (
                    <CldImage
                      key={index}
                      width="60"
                      height="60"
                      src={item.imageUrl}
                      sizes="100vw"
                      crop="fill"
                      alt="Description of my image"
                    />
                  ))}
            </div>
          </CardHeader>
          <Card.Body>
            <div className={styles.cardBody} >
              {" "}
              <Card.Text>
                <i> Deck count: {BeginnerDeck && BeginnerDeck.data.length}</i>
              </Card.Text>
              <Link href={`/flashcardDetails/Beginner`}>
                <Button size="sm" variant="outline-secondary">View</Button>
              </Link>
            </div>
          </Card.Body>
        </Card>

        <Card style={{ width: "24rem" }}>
          <CardHeader className={styles.cardHeader}>Intermediate</CardHeader>
          <CardHeader>
            <div className={styles.previewDeck}>
              {IntermediateDeck &&
                IntermediateDeck.data
                  .slice(0, 5)
                  .map((item, index) => (
                    <CldImage
                    key={index}
                      width="60"
                      height="60"
                      src={item.imageUrl}
                      sizes="100vw"
                      crop="fill"
                      alt="Description of my image"
                    />
                  ))}
            </div>
          </CardHeader>
          <Card.Body>
          <div className={styles.cardBody} >
            <Card.Text>
              <i>
                {" "}
                Deck count: {IntermediateDeck && IntermediateDeck.data.length}
              </i>
            </Card.Text>
            <Link href={`/flashcardDetails/Intermediate`}>
              <Button size="sm" variant="outline-secondary">View</Button>
            </Link></div>
          </Card.Body>
        </Card>

        <Card style={{ width: "24rem" }}>
          <CardHeader className={styles.cardHeader}>Advanced</CardHeader>
          <CardHeader>
            <div className={styles.previewDeck}>
              {AdvancedDeck &&
                AdvancedDeck.data
                  .slice(0, 5)
                  .map((item, index) => (
                    <CldImage
                    key={index}
                      width="60"
                      height="60"
                      src={item.imageUrl}
                      sizes="100vw"
                      crop="fill"
                      alt="Description of my image"
                    />
                  ))}
            </div>
          </CardHeader>
          <Card.Body>
          <div className={styles.cardBody} >
            <Card.Text>
              <i>
                Deck count:{" "}
                {AdvancedDeck && AdvancedDeck.data.length}
              </i>
            </Card.Text>
            <Link href={`/flashcardDetails/Advanced`}>
              <Button size="sm" variant="outline-secondary">View</Button>
            </Link>
            </div>
          </Card.Body>
        </Card>

        {/* <p>{BeginnerDeck && BeginnerDeck.data[0].frontside}</p> */}
      </div>
      <div className={styles.backgroundDiv}></div>
    </>
  );
}

export default Flashcardspage;
