import { asyncError, errorHandler } from "../../../../middlewares/error";
import dbConnect from "../../../../utils/mongo";
import { checkAuth } from "../../../../utils/features";
import { Product } from "../../../../models/product";
const handler = asyncError(async (req, res) => {
  await dbConnect();
  const { method } = req;
  if (method !== "GET")
    return errorHandler(res, 400, "Only GET Method is allowed");
  const user = await checkAuth(req);
  if (!user) return errorHandler(res, 401, "Login First");
  if (!user?.isSeller) return errorHandler(res, 401, "Only Seller is allowed");
  const products = await Product.find({ userId: user._id });
  res
    .status(200)
    .json({ success: true, message: "Fetch seller Products", products });
});

export default handler;
