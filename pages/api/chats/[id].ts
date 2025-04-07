import dbConnect from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import ChatsModel from "../../../models/Chats";
import UsersModel from "../../../models/User";

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
    case "GET" /* Get a model by UserId */:
      try {
        const chats = await ChatsModel.findOne({user_id:id});
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

    // case "PUT" /* Edit a model by its ID */:
    //   try {
    //     const chats = await ChatsModel.findByIdAndUpdate(id, req.body, {
    //       new: true,
    //       runValidators: true,
    //     });
    //     if (!chats) {
    //       return res.status(400).json({ success: false });
    //     }
    //     res
    //       .status(200)
    //       .json({ success: true, data: chats, message: "Update succesfull" });
    //   } catch (error) {
    //     res.status(400).json({ success: false });
    //   }
    //   break;

    case "DELETE" /* Delete a model by UserId */:
      try {
        const deletedChats = await ChatsModel.findOneAndDelete({ user_id: id });
        if (!deletedChats) {
          return res.status(400).json({ success: false, message: "No chats in the Database found"  });
        }
        const deletedChatIdFromUserprofile =await UsersModel.findOneAndUpdate({_id: id}, {$set:{chats:[]}}, {new:true});
        if (!deletedChatIdFromUserprofile) {
          return res.status(400).json({
            success: false,
            message: "User profile update failed",
          });
        }
if (deletedChatIdFromUserprofile)
 {       res
          .status(200)
          .json({
            success: true,
            data: {},
            message: "User's chats successfully cleared",
          });}
      } catch (error) {
        res
          .status(400)
          .json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
