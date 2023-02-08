import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is a required field!"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      required: [5, "Product price should not be more than 5 digits"],
    },
    description: {
      type: String,
      // Use some form of editor - personal assignment
    },
    photos: [
      {
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Products", productSchema);
