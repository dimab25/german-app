import dbConnect from "@/lib/mongodb";
import FlashcardsModel from "../../../models/Fleshcards";
import UsersModel from "../../../models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const flashcards = await FlashcardsModel.find({});
    return NextResponse.json({ success: true, data: flashcards }, { status: 200 });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch flashcards" }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json(); // Parsing the body of the request
    const newFlashcard = await FlashcardsModel.create(body); 

    // Add flashcard to the user's list of flashcards
    const userFlashcardId = await UsersModel.findByIdAndUpdate(
      body.user_id,
      { $push: { flashcards: newFlashcard._id } },
      { new: true } 
    );

    if (!userFlashcardId) {
      return NextResponse.json(
        { success: false, message: "User update failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: newFlashcard,
        message: "Flashcard successfully created",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating flashcard:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create flashcard" },
      { status: 400 }
    );
  }
}
