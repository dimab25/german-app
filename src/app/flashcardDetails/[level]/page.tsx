"use client";
import useFetchHook from "@/hooks/useFetchHook";
import { useParams } from "next/navigation";
import { APIOkResponseFlashcards } from "../../../../types/customTypes";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { Button, Card, CardFooter } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { useSession } from "next-auth/react";
import { Loader } from "@/utils/loader";
import "@/styles/global.css";
import styles from "./page.module.css";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";



function FlashcardDetails() {
     const { data, status } = useSession();
  const { level } = useParams<{ level: string }>();

  const [imageLoaded, setImageLoaded] = useState(false); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [successAdded, setSuccessAdded] = useState<boolean | false>(false);
  const [show, setShow] = useState(false);
  const target = useRef(null);
  
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

const handleImageLoad = () => {
  console.log("image has loaded");
  setImageLoaded(true); 
};

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
    setShow(false);
    if (deck) {
      setCurrentIndex((prev) => (prev + 1) % deck.data.length);
    }
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setShow(false);
    if (deck) {
      setCurrentIndex(
        (prev) => (prev - 1 + deck.data.length) % deck.data.length
      );
    }
  };

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

  useEffect(() => {
    setImageLoaded(false); 
  }, [currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {" "}
      <div className={styles.pageLayout}>
      <p style={{textAlign:"center"}}><i>{level} deck</i></p>
      <div style={{ display: "flex", justifyContent: "center", textAlign:"center" }}>
        <Card  style={{ width: "100%", maxWidth: "50rem", minWidth: "14rem" }}>
    
          {deck && deck.data[currentIndex].imageUrl.length > 0 ? (
              <div className={styles.flashcards} >
                {!imageLoaded && <Loader />}
            <Card.Img
              as={CldImage}
              width="500"
              height="300"
              src={deck.data[currentIndex].imageUrl}
              sizes="60vw"
              crop="fill"
              alt="Description of my image"
              onLoad= {handleImageLoad}
              style={{
                objectFit: "cover",
                height: "100%",
                width: "100%",
                opacity: imageLoaded ? 1 : 0, 
                
              }}
        
            /></div>
          ) : null}

          <Card.Body onClick={() => setShowAnswer(!showAnswer)}>
            <Card.Text ref={target}>{deck && deck.data[currentIndex].frontside}</Card.Text>
            <Overlay target={target.current} show={show} placement="right" >
            {(props) => (
              <Tooltip id="auto-tooltip" {...props}>
                Click here!
              </Tooltip>
            )}
          </Overlay>
          </Card.Body>

          {showAnswer && deck ? (
            <CardFooter>{deck.data[currentIndex].backside}</CardFooter>
          ) : null}
          <CardFooter
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button size="sm" onClick={handlePrev} variant="outline-secondary">
              <FaArrowLeft />
            </Button>{" "}
            {data?.user?.id && (
  (exists === false || (deck2 && deck2.success === false)) ? (
    <Button  onClick={addFlashcard} variant="outline-secondary">
      +
    </Button>
  ) : (
    <Button onClick={deleteFlashcard} variant="outline-secondary">
      -
    </Button>
  )
)}
     

          
            <Button  size="sm" onClick={handleNext} variant="outline-secondary">
              <FaArrowRight />
            </Button>
          </CardFooter>
        </Card>
      </div>
      {deck && deck?.data.length > 0 ? (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <i>
              Count:{currentIndex + 1}/{deck.data.length}
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

export default FlashcardDetails;
