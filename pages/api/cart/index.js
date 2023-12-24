import dbConnect from "../../../utils/mongo";
import { asyncError, errorHandler } from "../../../middlewares/error";
import { Cart } from "../../../models/cart";
import { checkAuth } from "../../../utils/features";

const handler = asyncError(async (req, res) => {
  await dbConnect();
  if (req.method !== "GET")
    return errorHandler(res, 400, "Only GET Method is allowed");
  const user = await checkAuth(req);
  if (!user) return errorHandler(res, 401, "Login First");

  const cart = await Cart.find({ userId: user._id }).populate("productId");
  res.status(200).json({
    success: true,
    message: "Product successfully fatched",
    cart,
  });
});

export default handler;
