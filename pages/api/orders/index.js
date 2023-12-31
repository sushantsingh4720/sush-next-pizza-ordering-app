import { asyncError, errorHandler } from "../../../middlewares/error";
import dbConnect from "../../../utils/mongo";
import { checkAuth } from "../../../utils/features";
import { Order } from "../../../models/order";
const handler = asyncError(async (req, res) => {
  await dbConnect();
  if (req.method !== "GET")
    return errorHandler(res, 400, "Only GET Method is allowed");
  const user = await checkAuth(req);
  if (!user) return errorHandler(res, 401, "Login First");
  const orders = await Order.aggregate([
    {
      $match: {
        userId: user._id,
      },
    },
  ]);
  res.status(200).json({
    success: true,
    message: "Orders successfully fatched",
    orders,
  });
});

export default handler;
