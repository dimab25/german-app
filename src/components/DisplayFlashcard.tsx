// "use client";
// import { IoIosSettings } from "react-icons/io";
// import { FaArrowLeft } from "react-icons/fa";
// import { FaArrowRight } from "react-icons/fa";
// import React, { useEffect, useState } from "react";
// import { CardFooter, Form, FormText, Modal } from "react-bootstrap";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import "@/styles/global.css";
// import { Flashcard } from "../../types/customTypes";
// import { useSession } from "next-auth/react";

// function DisplayFlashcard() {
//       const { status, data } = useSession();
//        console.log('status :>> ', status);
//        console.log('data :>> ', data);

//   const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
//   const [updatedFlashcard, setUpdatedFlashcard] = useState<Flashcard | null>(
//     null
//   );

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [show, setShow] = useState(false);

//   const [successUpdate, setSuccessUpdate] = useState<boolean | false>(false);
//   const [successDelete, setSuccessDelete] = useState<boolean | false>(false);
//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   const getFlashcards = async () => {
//     try {
//       const requestOptions: RequestInit = {
//         method: "GET",
//         redirect: "follow",
//       };
//       const response = await fetch(
//         "http://localhost:3000/api/flashcards/67ee55b7fcafbc953cfe0f56",
//         requestOptions
//       );
//       const result = await response.json();
//       setFlashcards(result.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   console.log("flashcards :>> ", flashcards);
//   console.log("updatedFlashcard :>> ", updatedFlashcard);

//   const handleNext = () => {
//     setShowAnswer(false);
//     if (flashcards) {
//       setCurrentIndex((prev) => (prev + 1) % flashcards.length);
//     }
//   };

//   const handlePrev = () => {
//     setShowAnswer(false);
//     if (flashcards) {
//       setCurrentIndex(
//         (prev) => (prev - 1 + flashcards.length) % flashcards.length
//       );
//     }
//   };

//   const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     console.log("e.target.value :>> ", e.target.value);
//     setUpdatedFlashcard({
//       ...updatedFlashcard!,
//       [e.target.name]: e.target.value,
//     });
//   };
//   //   if (flashcards.length === 0) return <p>Loading...</p>;
//   const submitUpdatedFlashcard = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault();
//     try {
//       if (flashcards) {
//         const myHeaders = new Headers();
//         myHeaders.append("Content-Type", "text/plain");

//         const raw = JSON.stringify({
//           backside: updatedFlashcard?.backside,
//           frontside: updatedFlashcard?.frontside,
//         });
//         const requestOptions: RequestInit = {
//           method: "PUT",
//           headers: myHeaders,
//           body: raw,
//           redirect: "follow",
//         };

//         const response = await fetch(
//           `http://localhost:3000/api/flashcards/${flashcards[currentIndex]._id}`,
//           requestOptions
//         );
//         const result = await response.json();
//         setSuccessUpdate(result.success);
//         getFlashcards();
//         setTimeout(() => {
//           handleClose();
//           setSuccessUpdate(false);
//         }, 1000);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   const submitDeleteFlashcard = async (
//     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
//   ) => {
//     e.preventDefault();
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this card? This action cannot be undone."
//       )
//     ) {
//       return; // Stop execution if the user cancels
//     }
//     try {
//       if (flashcards) {
//         const requestOptions: RequestInit = {
//           method: "DELETE",
//           redirect: "follow",
//         };
//         const response = await fetch(
//           `http://localhost:3000/api/flashcards/${flashcards[currentIndex]._id}`,
//           requestOptions
//         );
//         const result = await response.json();
//         setSuccessDelete(result.success);
// setTimeout(() => {

//     handleClose();
//     setSuccessDelete(false)
//         getFlashcards();
//         setCurrentIndex(0);
// }, 1000);
        
        
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     getFlashcards();
//   }, []);

//   return (
//     <>
//       <Card style={{ width: "18rem" }}>
//         {flashcards && flashcards[currentIndex].imageUrl.length > 0 ? (
//           <Card.Img
//             variant="top"
//             src={flashcards && flashcards[currentIndex].imageUrl}
//           />
//         ) : null}

//         <Card.Body onClick={() => setShowAnswer(!showAnswer)}>
//           {/* <Card.Title>Card Title</Card.Title> */}
//           <Card.Text>
//             {flashcards && flashcards[currentIndex].frontside}
//           </Card.Text>
//         </Card.Body>

//         {showAnswer && flashcards ? (
//           <CardFooter>{flashcards[currentIndex].backside}</CardFooter>
//         ) : null}
//         <CardFooter
//           style={{ display: "flex", justifyContent: "space-between" }}
//         >
//           <Button onClick={handlePrev} variant="outline-secondary" >
//           <FaArrowLeft />
//           </Button>{" "}
//           <Button variant="outline-secondary" onClick={handleShow}>
//           <IoIosSettings />
//           </Button>
//           <Button onClick={handleNext} variant="outline-secondary" >
//           <FaArrowRight />
//           </Button>
//           <Modal show={show} onHide={handleClose}>
//             <Modal.Header closeButton>
//               <Modal.Title>Change card</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <Form onSubmit={submitUpdatedFlashcard}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Frontside</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={2}
//                     onChange={handleInput}
//                     type="text"
//                     name="frontside"
//                     placeholder={
//                       flashcards && flashcards[currentIndex].frontside
//                     }
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Backside</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={2}
//                     onChange={handleInput}
//                     type="text"
//                     name="backside"
//                     placeholder={
//                       flashcards && flashcards[currentIndex].backside
//                     }
//                   />
//                 </Form.Group>
//                 {successUpdate && <FormText>Flashcard updated!</FormText>}
//                 {successDelete && <FormText>Flashcard deleted!</FormText>}
//                 <div
//                   style={{ display: "flex", justifyContent: "space-between" }}
//                 >
//                   <Button type="submit">Save</Button>
//                   <Button onClick={submitDeleteFlashcard} variant="danger">Delete</Button>{" "}
//                   <Button variant="secondary" onClick={handleClose}>
//                     Close
//                   </Button>
//                 </div>
//               </Form>
//             </Modal.Body>
//           </Modal>
//         </CardFooter>
//       </Card>
//     </>
//   );
// }

// export default DisplayFlashcard;
