import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import ChatsModel from "../../models/Chats";
import UsersModel from "../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const chats = await ChatsModel.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: chats });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      const { user_id, from, to, text } = req.body;
      try {
        const chatByUser = await ChatsModel.findOne({
          user_id: user_id,
        });
        if (chatByUser) {
          const newMessageObject = {
            user_id: user_id,
            from: from,
            to: to,
            text: text,
          };

          const newMessage = await ChatsModel.updateOne(
            { user_id: user_id },
            { $push: { messages: newMessageObject } }
          );
          if (newMessage) {
            res.status(201).json({
              success: true,
              message: "Chat succesfully saved",
              newMessage,
              newMessageObject,
            });
          }
        }
        if (!chatByUser) {
          const newMessageObject = {
            from: from,
            to: to,
            text: text,
          };

          const newChatByUser = new ChatsModel({
            user_id: user_id,
            messages: [newMessageObject],
          });
          const newChatRoom = await newChatByUser.save();
          console.log("newChatRoom :>> ", newChatRoom._id);

          if (newChatRoom) {
            await UsersModel.findOneAndUpdate(
              { _id: user_id },
              { $push: { chats: newChatRoom._id } }
            );

            res.status(201).json({
              success: true,
              data: newChatRoom,
              message: "New chat created and message saved",
            });
          }
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
