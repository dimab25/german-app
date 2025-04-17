import dbConnect from "@/lib/mongodb";
import FlashcardsModel from "../../../../models/Fleshcards";
import UsersModel from "../../../../models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: {id: string } }) {
  await dbConnect();

  const {id } = await context.params;

  try {
    const flashcards = await FlashcardsModel.find({ user_id: id });

    if (!flashcards || flashcards.length === 0) {
      return NextResponse.json({ success: false, message: "No flashcards found for this user" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: flashcards }, { status: 200 });
  } catch (error) {
    console.error("Error fetching flashcards by user_id:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch flashcards" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
  const { id } = await context.params;
  const body = await req.json();

  try {
    const updatedFlashcard = await FlashcardsModel.findByIdAndUpdate(
      id, body , 
      {
        new: true,         
        runValidators: true, 
      }
    );

    if (!updatedFlashcard) {
      return NextResponse.json({ success: false, message: "Flashcard not found" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: updatedFlashcard,
      message: "Update successful",
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating flashcard:", error);
    return NextResponse.json({ success: false, message: "Failed to update flashcard" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();

  const { id } = await context.params;

  try {
        const deletedFlashcard = await FlashcardsModel.deleteOne({ _id: id });

    if (!deletedFlashcard) {
      return NextResponse.json({
        success: false,
        message: "No flashcard found in the database",
      }, { status: 400 });
    }

    
    const deletedFlashcardIdUserProfile = await UsersModel.findOneAndUpdate(
      { flashcards: id },
      { $pull: { flashcards: id } },
      { new: true }
    );

    if (!deletedFlashcardIdUserProfile) {
      return NextResponse.json({
        success: false,
        message: "Failed to remove flashcard reference from user profile",
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {},
      message: "Flashcard successfully deleted",
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete flashcard",
    }, { status: 400 });
  }
}
