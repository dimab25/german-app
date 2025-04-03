import mongoose from "mongoose";
import { format } from "path";
const chatSchema = new mongoose.Schema(
  {
    from: { require: true, type: String },
    to: { require: true, type: String },
    text: { require: true, type: String },
  },
  { timestamps: { createdAt: "created_at", modifiedAt: "modified_at" } }
);

const chatsSchema = new mongoose.Schema(
  {
    user_id: { require: true, type: String },
    messages: { type: [chatSchema], default: [] },
  },
  { timestamps: { createdAt: "created_at", modifiedAt: "modified_at" } }
);
const ChatsModel = mongoose.model("Chat", chatsSchema);
export default ChatsModel;
