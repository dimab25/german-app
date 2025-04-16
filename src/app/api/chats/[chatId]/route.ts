import dbConnect from "@/lib/mongodb";
import ChatsModel from "@/models/Chats";
import UsersModel from "@/models/User";

import { NextRequest, NextResponse } from "next/server";

// get single chat by chatID
export async function GET(
  req: NextRequest,
  context: { params: { chatId: string } }
) {
  await dbConnect();

  const { chatId } = await context.params;

  try {
    const singleChat = await ChatsModel.find({ _id: chatId });

    if (!singleChat) {
      return NextResponse.json(
        { success: false, message: "The chat couldn't be found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Single chat successfully retrieved",
        data: singleChat,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching chats from database" },
      { status: 400 }
    );
  }
}

// add new messages to existing chat: user saves a chat for the 2nd time, after adding new messages on the single chat page
export async function POST(
  req: NextRequest,
  context: { params: { chatId: string } }
) {
  await dbConnect();
  const { chatId } = await context.params;
  const { user_id, messages } = await req.json();
  try {
    const existingChat = await ChatsModel.findOne({ _id: chatId, user_id });

    if (existingChat) {
      await ChatsModel.updateOne(
        { _id: chatId },
        { $push: { messages: { $each: messages } } }
      );
      return NextResponse.json(
        {
          success: true,
          message: "Messages added to existing chat",
          messages,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Chat not found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("POST /api/chats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save chat" },
      { status: 400 }
    );
  }
}

// old function to delete chat using user ID to be updated with chat ID
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { id } = await context.params;

  try {
    // Delete chat by user_id
    const deletedChats = await ChatsModel.findOneAndDelete({ user_id: id });

    if (!deletedChats) {
      return NextResponse.json(
        {
          success: false,
          message: "No chats in the database found",
        },
        { status: 400 }
      );
    }

    // Clear chat reference from user profile
    const deletedChatIdFromUserProfile = await UsersModel.findOneAndUpdate(
      { _id: id },
      { $set: { chats: [] } },
      { new: true }
    );

    if (!deletedChatIdFromUserProfile) {
      return NextResponse.json(
        {
          success: false,
          message: "Users chats reference delete failed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {},
        message: "User's chats successfully cleared",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/chats/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 400 }
    );
  }
}
