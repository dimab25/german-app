import mongoose from "mongoose";

const flashcardsSchema = new mongoose.Schema(
  {
    backside: { required: false, type: String },
    frontside: { required: false, type: String },
    imageUrl: { required: false, type: String },
    user_id: { required: true, type: String },
    level: { required: false, type: String },
  },
  { timestamps: { createdAt: "created_at", modifiedAt: "modified_at" } }
);
const FlashcardsModel =
  mongoose.models.Flashcard || mongoose.model("Flashcard", flashcardsSchema);
export default FlashcardsModel;
