// "use client"
// import useFetchHook from '@/hooks/useFetchHook';
// import React from 'react'
// import { APIOkResponseFlashcards } from '../../types/customTypes';
// import { Button, Card } from 'react-bootstrap';


// function DecksFlashcard() {
//     const { data: BeginnerDeck } = useFetchHook<APIOkResponseFlashcards>(
//         "http://localhost:3000/api/flashcards/Beginner"
//       );

//       const { data: IntermediateDeck } = useFetchHook<APIOkResponseFlashcards>(
//         "http://localhost:3000/api/flashcards/Beginner"
//       );
//       const { data: AdvancedDeck } = useFetchHook<APIOkResponseFlashcards>(
//         "http://localhost:3000/api/flashcards/Beginner"
//       );
//       console.log('dataBeginner :>> ', BeginnerDeck);
//       console.log('IntermediateDeck :>> ', IntermediateDeck);
// console.log('AdvancedDeck :>> ', AdvancedDeck);
//   return (
//   <>
//   <div style={{background:"grey"}}>
//   <Card style={{ width: '18rem' }}>
//       <Card.Img variant="top" src="holder.js/100px180" />
//       <Card.Body>
//         <Card.Title>Beginner</Card.Title>
//         <Card.Text>Deckcount:
//           {BeginnerDeck && BeginnerDeck.data.length}
//         </Card.Text>
//         <Button variant="primary">View Deck</Button>
//       </Card.Body>
//     </Card>



// <p>{BeginnerDeck&& BeginnerDeck.data[0].frontside}</p>
// </div>

//   </>
//   )
// }

// export default DecksFlashcard