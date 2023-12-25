import mongoose from "mongoose";
import dbConnect from "../../../../utils/mongo";
import { asyncError, errorHandler } from "../../../../middlewares/error";
import { checkAuth } from "../../../../utils/features";
import { Cart } from "../../../../models/cart";

const handler = asyncError(async (req, res) => {
  await dbConnect();
  if (req.method !== "DELETE")
    return errorHandler(res, 400, "Only DELETE Method is allowed");
  const user = await checkAuth(req);
  if (!user) return errorHandler(res, 401, "Login First");
  const { id } = req.query;
  if (!id) return errorHandler(res, 400, "Please Provid a valid Product Id");
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isObjectId)
    return errorHandler(res, 400, "Please Provid a valid Product Id");
  const cartItem = await Cart.findOne({ _id: id, userId: user._id });
  if (!cartItem) return errorHandler(res, 404, "Not Found");
  const deleteCartItem = await Cart.findOneAndDelete({
    _id: id,
    userId: user._id,
  });
  res.status(200).json({
    success: true,
    message: "Delete Item to cart successfully",
  });
});

export default handler;
