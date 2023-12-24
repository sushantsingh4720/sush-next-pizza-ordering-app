import mongoose from "mongoose";
import { asyncError, errorHandler } from "../../../../middlewares/error";
import { Product } from "../../../../models/product";
import { checkAuth } from "../../../../utils/features";
import dbConnect from "../../../../utils/mongo";
import { Cart } from "../../../../models/cart";


const handler = asyncError(async (req, res) => {
  await dbConnect();
  if (req.method !== "POST")
    return errorHandler(res, 400, "Only POST Method is allowed");
  const user = await checkAuth(req);
  if (!user) return errorHandler(res, 401, "Login First");
  const { productId } = req.body;
  if (!productId) return errorHandler(res, 400, "Please Provid a valid Product Id");
  const isObjectId = mongoose.Types.ObjectId.isValid(productId);
  if (!isObjectId)
    return errorHandler(res, 400, "Please Provid a valid Product Id");
  const product = await Product.findById(productId);
  if (!product) return errorHandler(res, 404, "Not Found");
  const cart=await Cart.create({
    ...req.body,
    productId,
    userId:user._id,
  })
  res.status(200).json({
    success: true,
    message: "added to cart successfully",
  });
});

export default handler;
