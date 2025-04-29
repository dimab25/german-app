import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   const formData = await req.formData();

  console.log('formData :>> ', formData);
  const file = formData.get("file") as File;
console.log('file :>> ', await file);
  const fileBuffer = await file.arrayBuffer();
  console.log('fileBuffer :>> ', fileBuffer);
//  Multipurpose Internet Mail Extensions = mime
  const mimeType = file.type;
  console.log('mimeType :>> ', mimeType);
  const maxSize =  2 *1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(mimeType)) {
    return NextResponse.json(
      { message: "Unsupported file type" },
      { status: 400 }
    );
  }
  if (file.size > maxSize) {
    return NextResponse.json({ message: "File too large" }, { status: 400 });
  }
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");
// console.log('base64Data :>> ', base64Data);

  // this will be used to upload the file
  const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;
// console.log('fileUri :>> ', fileUri);
  const res = await uploadToCloudinary(fileUri, file.name);

  if (res.success && res.result) {
     return NextResponse.json({ 
       success:true, message: "Image upload succesfull", imgUrl: res.result.secure_url 
     }); 
   } else return NextResponse.json({ message: "failure" });
}

// no multer required, cause next.Js.formData can handle it 