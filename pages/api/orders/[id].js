import mongoose from "mongoose";
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
  const { id } = req.query;
  if (!id) return errorHandler(res, 400, "Please Provid a valid Order Id");
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isObjectId)
    return errorHandler(res, 400, "Please Provid a valid Product Id");
 
    const order = await Order.findOne({ _id: id, userId: user._id }).populate({
    path: "orders.userId",
    select: "name email img phone", // Add the fields you want to include
  });
  if(!order) return errorHandler(res,404,'Order Not Found');
  res.status(200).json({
    success: true,
    message: "Orders successfully fatched",
    order,
  });
});

export default handler;
