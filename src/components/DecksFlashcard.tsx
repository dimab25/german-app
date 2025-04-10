"use client"
import useFetchHook from '@/hooks/useFetchHook';
import React from 'react'
import { APIOkResponseFlashcards } from '../../types/customTypes';


function DecksFlashcard() {
    const { data: BeginnerDeck } = useFetchHook<APIOkResponseFlashcards>(
        "http://localhost:3000/api/flashcards/Beginner"
      );

      const { data: IntermediateDeck } = useFetchHook<APIOkResponseFlashcards>(
        "http://localhost:3000/api/flashcards/Beginner"
      );
      const { data: AdvancedDeck } = useFetchHook<APIOkResponseFlashcards>(
        "http://localhost:3000/api/flashcards/Beginner"
      );
      console.log('dataBeginner :>> ', BeginnerDeck);
      console.log('IntermediateDeck :>> ', IntermediateDeck);
console.log('AdvancedDeck :>> ', AdvancedDeck);
  return (
  <>
<p>{BeginnerDeck&& BeginnerDeck.data[0].frontside}</p>

  </>
  )
}

export default DecksFlashcard