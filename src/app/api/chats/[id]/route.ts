import dbConnect from "@/lib/mongodb";
import ChatsModel from "@/models/Chats";
import UsersModel from "@/models/User";

import { NextRequest, NextResponse } from "next/server";

// get all users' chats
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();

  const { id } = await context.params;

  try {
    const chats = await ChatsModel.find({ user_id: id });

    if (!chats) {
      return NextResponse.json(
        { success: false, message: "No chats found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, amount: chats.length, data: chats },
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

// add new messages to existing chat - when the user saves a chat for the 2nd time, after adding new messages to it
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { id: chatId } = await context.params;
  const { user_id, messages } = await req.json();
  try {
    if (!chatId) {
      const newChat = new ChatsModel({
        user_id,
        messages,
      });

      await newChat.save();

      return NextResponse.json(
        {
          success: true,
          data: newChat,
          message: "New chat created",
        },
        { status: 201 }
      );
    }

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
    }
  } catch (error) {
    console.error("POST /api/chats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save chat" },
      { status: 400 }
    );
  }
}

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
