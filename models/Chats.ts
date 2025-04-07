import mongoose from "mongoose";
import { format } from "path";
const chatSchema = new mongoose.Schema(
  {
    from: { required: true, type: String },
    to: { required: true, type: String },
    text: { required: true, type: String },
  },
  { timestamps: { createdAt: "created_at", modifiedAt: "modified_at" } }
);

const chatsSchema = new mongoose.Schema(
  {
    user_id: { required: true, type: String },
    messages: { type: [chatSchema], default: [] },
  },
  { timestamps: { createdAt: "created_at", modifiedAt: "modified_at" } }
);
const ChatsModel = mongoose.model("Chat", chatsSchema);
export default ChatsModel;
