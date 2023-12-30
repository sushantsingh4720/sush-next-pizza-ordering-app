import mongoose from "mongoose";
import { asyncError, errorHandler } from "../../../../../middlewares/error";
import { Product } from "../../../../../models/product";
import { checkAuth } from "../../../../../utils/features";
import dbConnect from "../../../../../utils/mongo";

const handler = asyncError(async (req, res) => {
  await dbConnect();
  if (req.method !== "DELETE")
    return errorHandler(res, 400, "Only DELETE Method is allowed");
  const { id } = req.query;
  if (!id) return errorHandler(res, 400, "Please Provid a valid Product Id");
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isObjectId)
    return errorHandler(res, 400, "Please Provid a valid Product Id");
  const user = await checkAuth(req);
  if (!user) return errorHandler(res, 401, "Login First");
  if (!user?.isSeller) return errorHandler(res, 401, "Only Seller is allowed");
  const deletedItems = await Product.findOneAndDelete({
    _id: id,
    userId: user._id,
  });
  res
    .status(200)
    .json({ success: true, message: "product Deleted successfully" });
});
export default handler;
