import mongoose from "mongoose";

const flashcardsSchema = new mongoose.Schema(
    {
        backside: { require: true, type: String },
        frontside: { require: true, type: String },
        imageUrl: { require: true, type: String },
        user_id: { require: true, type: String },
    
    },
    { timestamps: { createdAt: "created_at", modifiedAt: "modified_at" } }
  );
  const FlashcardsModel = mongoose.model("Flashcard", flashcardsSchema);
  export default FlashcardsModel;