import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import FlashcardsModel from "../../models/Fleshcards";
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
        const flashcards = await FlashcardsModel.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: flashcards });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const newFlashcard = await FlashcardsModel.create(
          req.body
        ); /* create a new model in the database */
        const userFlashcardId = await UsersModel.findByIdAndUpdate(
          { _id: req.body.user_id },
          { $push: { flashcards: newFlashcard._id } }
        );

        res
          .status(201)
          .json({
            success: true,
            data: newFlashcard,
            message: "Flashcard succesfully created",
          });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
