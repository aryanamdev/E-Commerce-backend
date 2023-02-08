import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is a required field!"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Products", productSchema);
