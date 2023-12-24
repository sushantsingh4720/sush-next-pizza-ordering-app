import dbConnect from "../../../utils/mongo";
import { Product } from "../../../models/product";
import { asyncError } from "../../../middlewares/error";

const handler = asyncError(async (req, res) => {
  await dbConnect();
  if (req.method !== "GET")
    return errorHandler(res, 400, "Only GET Method is allowed");
  const product = await Product.find();
  res.status(200).json({
    success: true,
    message: "Product successfully fatched",
    product,
  });
});

export default handler;
