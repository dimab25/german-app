import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import FlashcardsModel from "../../models/Fleshcards";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const users = await FlashcardsModel.find({}); /* find all the data in our database */
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const users = await FlashcardsModel.create(
          req.body,
        ); /* create a new model in the database */
        res.status(201).json({ success: true, data: users, message: "Flashcard succesfully created" });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}