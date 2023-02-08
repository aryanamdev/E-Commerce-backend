import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [True, "Please provide a category"],
      trim: true,
      maxLength: [
        120,
        "Collection name should not be more than 120 characters",
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Collections", collectionSchema);
