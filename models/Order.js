import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orders: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        title: { type: String, required: true },
        img: { type: String, required: true },
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
          required: true,
        },
        size: {
          type: Number,
          default: 0,
        },
      },
    ],
    address: {
      type: String,
      required: true,
      maxlength: 200,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    method: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Add a pre-hook to populate the 'userId' field in the 'orders' array with selected fields
OrderSchema.pre("find", function (next) {
  this.populate({
    path: "orders.userId",
    select: "name email img phone", // Add the fields you want to include
  });
  next()
});
export const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
