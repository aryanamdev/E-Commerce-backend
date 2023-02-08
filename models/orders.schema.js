import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          count: {
            type: Number,
          },
          price: {
            type: Number,
          },
        },
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    coupon: {
      type: String,
    },
    transactionId: { type: String },
    status: {
      type: String,
      enum: ["ORDERED", "SHIPPED", "DELIVERED", "CANCELLED"],
      //   Can we improve this?
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Orders", orderSchema);
