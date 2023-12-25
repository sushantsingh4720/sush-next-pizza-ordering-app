import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    extras: {
      type: [
        {
          text: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
    quantity: {
      type: Number,
      default: 1,
    },
    size: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add a pre-hook to populate both 'userId' and 'productId' fields in the 'carts' array
cartSchema.pre("find", function (next) {
  this.populate({
    path: "userId",
    select: "name email img phone", // Add the fields you want to include for 'userId'
  }).populate({
    path: "productId",
    // Add options for 'productId' population if needed
  });
  next();
});

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
