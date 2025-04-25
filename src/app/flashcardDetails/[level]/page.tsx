"use client";
import useFetchHook from "@/hooks/useFetchHook";
import { useParams } from "next/navigation";
import { APIOkResponseFlashcards } from "../../../../types/customTypes";
import { MouseEvent, useEffect, useState } from "react";
import { Button, Card, CardFooter } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { useSession } from "next-auth/react";


function FlashcardDetails() {
     const { data, status } = useSession();
  const { level } = useParams<{ level: string }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [successAdded, setSuccessAdded] = useState<boolean | false>(false);
  
  const [deck2, setDeck2] = useState<APIOkResponseFlashcards | null>(null);
  const { data: deck } = useFetchHook<APIOkResponseFlashcards>(
    `http://localhost:3000/api/flashcards/${level}`
  );
console.log('data :>> ', data);

  const getFlashcardsByUserID = async () => {
    try {
      if (data?.user){
      const requestOptions: RequestInit = {
        method: "GET",
        redirect: "follow",
      };
      const response = await fetch(
        `http://localhost:3000/api/flashcards/${data.user.id}`,
        requestOptions
      );
      const result = await response.json();
      setDeck2(result)};
    } catch (error) {
      console.error(error);
    }
  };
console.log(deck?.data[currentIndex].imageUrl);

  const addFlashcard = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (deck && data?.user) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");

        const raw = JSON.stringify({
          backside: deck.data[currentIndex].backside,
          frontside: deck.data[currentIndex].frontside,
          imageUrl: deck.data[currentIndex].imageUrl,
          user_id: data.user.id,
          level: "Difficult"
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
        const result: APIOkResponseFlashcards = await response.json();
        setSuccessAdded(result.success);
        getFlashcardsByUserID();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFlashcard = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const matchedItem =
        deck2 &&
        deck &&
        deck2.data?.find((item) =>
          item.frontside.includes(deck.data[currentIndex].frontside)
        );
      const matchedId = matchedItem?._id;

      const requestOptions: RequestInit = {
        method: "DELETE",
        redirect: "follow",
      };
      const response = await fetch(
        `http://localhost:3000/api/flashcards/${matchedId}`,
        requestOptions
      );
      const result = await response.json();
      console.log("result :>> ", result);
      getFlashcardsByUserID();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNext = () => {
    setShowAnswer(false);
    if (deck) {
      setCurrentIndex((prev) => (prev + 1) % deck.data.length);
    }
  };

  const handlePrev = () => {
    setShowAnswer(false);
    if (deck) {
      setCurrentIndex(
        (prev) => (prev - 1 + deck.data.length) % deck.data.length
      );
    }
  };
  console.log("Deck2 :>> ", deck2);
  console.log("level :>> ", level);
  console.log("successAdded :>> ", successAdded);

  const exists =
    deck2 &&
    deck &&
    deck2.data?.some((item) =>
      item.frontside.includes(deck.data[currentIndex].frontside)
    );

  console.log("exists :>> ", exists);

  useEffect(() => {
    getFlashcardsByUserID();
  }, []);


  return (
    <>
      {" "}
      <div>{level}</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card style={{ width: "20rem" }}>
          {/* {deck && deck.data[currentIndex].imageUrl.length > 0 ? (
          <Card.Img
            variant="top"
            src={deck && deck.data[currentIndex].imageUrl}
          />npm run dev
        ) : null} */}

          {deck && deck.data[currentIndex].imageUrl.length > 0 ? (
            <Card.Img
              as={CldImage}
              width="500"
              height="400"
              src={deck.data[currentIndex].imageUrl}
              sizes="60vw"
              crop="fill"
              alt="Description of my image"
          
        
            />
          ) : null}

          <Card.Body onClick={() => setShowAnswer(!showAnswer)}>
            <Card.Text>{deck && deck.data[currentIndex].frontside}</Card.Text>
          </Card.Body>

          {showAnswer && deck ? (
            <CardFooter>{deck.data[currentIndex].backside}</CardFooter>
          ) : null}
          <CardFooter
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button onClick={handlePrev} variant="outline-secondary">
              <FaArrowLeft />
            </Button>{" "}
            {exists == false || deck2 && deck2?.success===false  ? (
              <Button onClick={addFlashcard} variant="outline-secondary">
                +
              </Button>
            ) : (
              <Button onClick={deleteFlashcard} variant="outline-secondary">
                -
              </Button>
            )}
            <Button onClick={handleNext} variant="outline-secondary">
              <FaArrowRight />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default FlashcardDetails;
