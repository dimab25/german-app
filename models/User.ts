import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    email: { unique: true, require: true, type: String },
    name: { require: true, type: String },
    password: { require: true, type: String },

    imageUrl: { require: false, type: String },

    native_language: { require: true, type: String },

    flashcards: [
      {
        require: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flashcard",
      },
    ],
    chats: { require: true, type: String },
  },
  { timestamps: { createdAt: "created_at", modifiedAt: "modified_at" } }
);
const UsersModel = mongoose.model("User", usersSchema);
export default UsersModel;
