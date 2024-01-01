import { asyncError, errorHandler } from "../../../../middlewares/error";
import { checkAuth } from "../../../../utils/features";
import dbConnect from "../../../../utils/mongo";
import { Order } from "../../../../models/order";
const handler = asyncError(async (req, res) => {
  await dbConnect;
  const { method } = req;
  if (method !== "GET")
    return errorHandler(res, 404, "Only GET methods are alowed");
  const user = await checkAuth(req);
  if (!user) return errorHandler(res, 401, "Login First");
  if (!user?.isSeller) return errorHandler(res, 401, "Only Seller is allowed");
  const orders = await Order.aggregate([
    {
      $match: {
        "orders.userId": user._id, // Replace with the actual field in your schema
      },
    },
  ]);
  res
    .status(200)
    .json({ success: true, message: "Fetched Seller Orders", orders });
});

export default handler;
