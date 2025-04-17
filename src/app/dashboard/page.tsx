"use client"
import CreateFlashcard from "@/components/CreateFlashcard"
import Link from "next/link"


function Dashboard() {
  return (
    <>
    <div>Dashboard
    <Link href={`/flashcards`}>
     <div>Example Flashcards</div></Link>
     <Link href={`/userFlashcards`}><div>Users Flashcards</div></Link>
     
     <CreateFlashcard/>
    </div>
    </>
  )
}

export default Dashboard