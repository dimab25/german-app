// import dbConnect from "@/lib/mongodb";
// import UsersModel from "@/models/User";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   await dbConnect();
//   const { id } = await context.params;

//   try {
//     const user = await UsersModel.findById(id);
//     if (!user) {
//       return NextResponse.json({ success: false }, { status: 400 });
//     }
//     return NextResponse.json({ success: true, data: user });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: "No User in the Database found" },
//       { status: 400 }
//     );
//   }
// }

// export async function PUT(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   await dbConnect();
//   const { id } = await context.params;
//   const body = await req.json();

//   try {
//     const user = await UsersModel.findByIdAndUpdate(id, body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!user) {
//       return NextResponse.json({ success: false }, { status: 400 });
//     }
//     return NextResponse.json({
//       success: true,
//       data: user,
//       message: "Update successful",
//     });
//   } catch (error) {
//     return NextResponse.json({ success: false }, { status: 400 });
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   await dbConnect();
//   const { id } = await context.params;

//   try {
//     const deletedUser = await UsersModel.deleteOne({ _id: id });
//     if (!deletedUser) {
//       return NextResponse.json({ success: false }, { status: 400 });
//     }
//     return NextResponse.json({ success: true, data: {} });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: "No User found" },
//       { status: 400 }
//     );
//   }
// }
