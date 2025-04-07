import dbConnect from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import FlashcardsModel from "../../../models/Fleshcards";
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
    case "GET" /* Get a model by User_id */:
      try {
        const flashcard = await FlashcardsModel.find({user_id: id});
        if (!flashcard) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: flashcard });
      } catch (error) {
        res
          .status(400)
          .json({
            success: false,
            message: "No Flashcard in the Database found",
          });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const flashcard = await FlashcardsModel.findByIdAndUpdate(
          id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!flashcard) {
          return res.status(400).json({ success: false });
        }
        res
          .status(200)
          .json({
            success: true,
            data: flashcard,
            message: "Update succesfull",
          });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedFlashcard = await FlashcardsModel.deleteOne({ _id: id });
        const deletedFlashcardIdUserprofile= await UsersModel.findOneAndUpdate({flashcards: id}, {$pull:{flashcards: id}}, {new:true});
        if (!deletedFlashcard ) {
          return res.status(400).json({ success: false });
        }
        if (!deletedFlashcardIdUserprofile ) {
          return res.status(400).json({ success: false });
        }
        res
          .status(200)
          .json({
            success: true,
            data: {},
            message: "Flashcard succesfully deleted",
          });
      } catch (error) {
        res
          .status(400)
          .json({
            success: false,
            message: "No Flashcard in the Database found",
          });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
