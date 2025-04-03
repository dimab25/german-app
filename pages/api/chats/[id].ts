import dbConnect from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import ChatsModel from "../../../models/Chats";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const chats = await ChatsModel.findById(id);
        if (!chats) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: chats });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: "No chats in the Database found" });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const chats = await ChatsModel.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!chats) {
          return res.status(400).json({ success: false });
        }
        res
          .status(200)
          .json({ success: true, data: chats, message: "Update succesfull" });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedChats = await ChatsModel.deleteOne({ _id: id });
        if (!deletedChats) {
          return res.status(400).json({ success: false });
        }
        res
          .status(200)
          .json({
            success: true,
            data: {},
            message: "chats succesfully deleted",
          });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: "No chats in the Database found" });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
