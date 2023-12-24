import mongoose from "mongoose";
import { asyncError, errorHandler } from "../../../middlewares/error";
import dbConnect from "../../../utils/mongo";
import { Product } from "../../../models/product";

const handler = asyncError(async (req, res) => {
  await dbConnect();
  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) return errorHandler(res, 400, "Please Provid a valid Product Id");
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isObjectId)
      return errorHandler(res, 400, "Please Provid a valid Product Id");
    const product = await Product.findById(id);
    if (!product) return errorHandler(res, 404, "Not Found");
    res.status(200).json({
      success: true,
      message: "Product Fetched successfully",
      product,
    });
  }
});

export default handler;
