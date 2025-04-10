import dbConnect from "@/lib/mongodb";
import UsersModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request, res) {
  console.log("register runnning");
  const info = await req.json();
  console.log("req :>> ", info);
  if (req.method !== "POST") return res.status(405).end();

  // const { email, password, name, imageUrl, native_language } = await req.json();
  console.log("email :>> ", info.email);
  await dbConnect();

  const existingUser = await UsersModel.findOne({ email: info.email });

  if (existingUser)
    return Response.json({ error: "User already exists" }, { status: 409 });

  console.log("password :>> ", info.password);
  const hashedPassword = await bcrypt.hash(info.password, 10);

  if (!existingUser) {
    const user = await UsersModel.create({
      email: info.email,
      password: hashedPassword,
      name: info.name,
      native_language: info.native_language,
    });

    if (user) {
      return Response.json({
        message: "User created",
        user,
      });
    }
    if (!user) {
      return Response.json({ error: "Registration failed" }, { status: 404 });
    }
  }
}
