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