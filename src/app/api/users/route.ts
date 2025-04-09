
import { NextRequest, NextResponse } from "next/server";
import UsersModel from "../../../models/User";
import dbConnect from "@/lib/mongodb";


export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const users = await UsersModel.find({});
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 });
  }
}


// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { method } = req;

//   await dbConnect();

//   switch (method) {
//     case "GET":
//       try {
//         const users = await UsersModel.find(
//           {}
//         ); /* find all the data in our database */
//         res.status(200).json({ success: true, data: users });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;
//     case "POST":
//       try {
//         const users = await UsersModel.create(
//           req.body
//         ); /* create a new model in the database */
//         res
//           .status(201)
//           .json({
//             success: true,
//             data: users,
//             message: "User succesfully created",
//           });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;
//     default:
//       res.status(400).json({ success: false });
//       break;
//   }
// }
