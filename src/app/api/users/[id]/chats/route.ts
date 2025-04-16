import dbConnect from "@/lib/mongodb";
import ChatsModel from "@/models/Chats";
import UsersModel from "@/models/User";

import { NextRequest, NextResponse } from "next/server";

// get all chats by userID
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
      {
        success: true,
        message: "Chats retrieved successfully",
        amount: chats.length,
        data: chats,
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
