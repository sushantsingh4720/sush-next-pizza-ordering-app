import mongoose,{Schema} from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 60,
    },
    desc: {
      type: String,
      required: true,
      maxlength: 200,
    },
    img: {
      type: String,
      required: true,
    },
    prices: {
      type: [Number],
      required: true,
    },
    extraOptions: {
      type: [
        {
          text: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

// Add a pre-hook to populate the 'userId' field in the 'product' array with selected fields
ProductSchema.pre("find", function (next) {
  this.populate({
    path: "userId",
    select: "name email img phone", // Add the fields you want to include
  });
  next();
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
