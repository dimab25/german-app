import mongoose from "mongoose";

const flashcardsSchema = new mongoose.Schema(
    {
        backside: { required: true, type: String },
        frontside: { required: true, type: String },
        imageUrl: { required: true, type: String },
        user_id: { required: true, type: String },
    
    },
    { timestamps: { createdAt: "created_at", modifiedAt: "modified_at" } }
  );
  const FlashcardsModel = mongoose.models.Flashcard ||mongoose.model("Flashcard", flashcardsSchema);
  export default FlashcardsModel;