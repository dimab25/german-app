import dbConnect from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
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
    case "GET" /* Get a model by its ID */:
      try {
        const user = await UsersModel.findById(id);
        if (!user) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: "No User in the Database found" });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const user = await UsersModel.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!user) {
          return res.status(400).json({ success: false });
        }
        res
          .status(200)
          .json({ success: true, data: user, message: "Update succesfull" });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedUser = await UsersModel.deleteOne({ _id: id });
        if (!deletedUser) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: "No User in the Database found" });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
