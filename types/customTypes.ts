export interface APIOkResponseFlashcards {
  success: boolean;
  data: Flashcard[];
}

export interface Flashcard {
  _id: string;
  backside: string;
  frontside: string;
  imageUrl: string;
  level?: string;
  user_id: string;
  created_at?: string;
  updatedAt?: string;
  __v?: number;
}
export interface User{
  name: string; 
  email: string; 
  id: string; 
  password: string; 
  native_language: string; 
  
}

export interface APIOkResponseUser {
  success: boolean
  data: User
}

export interface User {
  _id: string
  email: string
  name: string
  password: string
  native_language: string
  flashcards: string[]
  chats: string[]
  created_at: string
  updatedAt: string
  imgUrl: string
  __v: number
}
