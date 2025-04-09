import dbConnect from '@/lib/mongodb';
import UsersModel from '@/models/User';
import bcrypt from 'bcryptjs';

export  async function POST(req:Request, res) {
  console.log("register runnning");
  const info = await req.json()
  console.log('req :>> ',info);
  if (req.method !== 'POST') return res.status(405).end();

 // const { email, password, name, imageUrl, native_language } = await req.json();
  console.log('email :>> ', info.email);
  await dbConnect();

  const existingUser = await UsersModel.findOne({ email:info.email });
  //if (existingUser) return res.status(400).json({ error: 'User already exists' });
  if (existingUser) return  Response.json({ error: 'User already exists' })
console.log('password :>> ', info.password);
  const hashedPassword = await bcrypt.hash(info.password, 10);
  const user = await UsersModel.create({ email:info.email, password: hashedPassword, name:info.name});
return  Response.json({ message: 'User created', user: { email: user.email } })
  return res.status(201).json({ message: 'User created', user: { email: user.email } });
}