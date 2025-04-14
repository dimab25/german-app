import dbConnect from "@/lib/mongodb";
import ChatsModel from "@/models/Chats";
import UsersModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// get all chats in DB
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const chats = await ChatsModel.find({});
    return NextResponse.json({ success: true, data: chats });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

// create a new chat in DB when the user saves it for the first time
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { user_id, messages } = await req.json();

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
  } catch (error) {
    console.error("POST /api/chats (no id) error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create chat" },
      { status: 400 }
    );
  }
}

// export async function POST(req: NextRequest) {
//   await dbConnect();

//   try {
//     const { user_id, messages } = await req.json();

//     const chatByUser = await ChatsModel.findOne({ user_id });

//     if (chatByUser) {
//       // Append to existing chat
//       const newMessage = await ChatsModel.updateOne(
//         { user_id },
//         { $push: { messages: messages } }
//       );

//       if (newMessage) {
//         return NextResponse.json(
//           {
//             success: true,
//             message: "Chat successfully saved",
//             messages,
//           },
//           { status: 201 }
//         );
//       }
//     } else {
//       // Create new chat
//       const newChatByUser = new ChatsModel({
//         user_id,
//         messages,
//       });

//       const newChatRoom = await newChatByUser.save();

//       if (newChatRoom) {
//         await UsersModel.findOneAndUpdate(
//           { _id: user_id },
//           { $push: { chats: newChatRoom._id } }
//         );

//         return NextResponse.json(
//           {
//             success: true,
//             data: newChatRoom,
//             message: "New chat created and messages saved",
//           },
//           { status: 201 }
//         );
//       }
//     }

//     return NextResponse.json(
//       { success: false, message: "Unknown error" },
//       { status: 500 }
//     );
//   } catch (error) {
//     console.error("POST /api/chats error:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to save chat" },
//       { status: 400 }
//     );
//   }
// }
