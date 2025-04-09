import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    email: { unique: true, required: true, type: String },
    name: { required: false, type: String },
    password: { required: true, type: String },

    imageUrl: { required: false, type: String },

    native_language: { required: false, type: String },

    flashcards: [
      {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flashcard",
      },
    ],
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  },
  { timestamps: { createdAt: "created_at", modifiedAt: "modified_at" } }
);
const UsersModel =mongoose.models.User || mongoose.model("User", usersSchema);
export default UsersModel;
