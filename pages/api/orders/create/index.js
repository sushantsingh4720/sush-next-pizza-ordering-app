import mongoose, { ObjectId } from "mongoose";
import { asyncError, errorHandler } from "../../../../middlewares/error";
import { Order } from "../../../../models/order";
import { checkAuth } from "../../../../utils/features";
import dbConnect from "../../../../utils/mongo";
import { Cart } from "../../../../models/cart";
const handler = asyncError(async (req, res) => {
  await dbConnect();

  if (req.method !== "POST")
    return errorHandler(res, 400, "Only POST Method is allowed");
  const user = await checkAuth(req);

  if (!user) return errorHandler(res, 401, "Login First");
  const { cart, address, total, status, method } = req.body;

  if (!cart || !address || !total)
    return errorHandler(res, 400, "Please enter all fields");
  const { orders, deleteCartItems } = ordersFuntion(cart);

  const order = await Order.create({
    userId: user._id,
    orders,
    address,
    total,
    status,
    method,
  });

  if (!order) return errorHandler(res, 400, "Not Success");

  await Cart.deleteMany({
    userId: user._id,
    _id: { $in: deleteCartItems },
  });

  res.status(200).json({
    success: true,
    message: "Success",
  });
});

export default handler;

function ordersFuntion(cart) {
  const orders = cart.map((item) => ({
    userId: item.productId.userId._id,
    title: item.productId.title,
    img: item.productId.img,
    extras: item.extras,
    quantity: item.quantity,
    size: item.size,
  }));

  const deleteCartItems = cart.map((item) => [item._id]);
  return { orders, deleteCartItems };
}
