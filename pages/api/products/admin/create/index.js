import { asyncError, errorHandler } from "../../../../../middlewares/error";
import { Product } from "../../../../../models/product";
import { checkAuth } from "../../../../../utils/features";
import dbConnect from "../../../../../utils/mongo";

const handler = asyncError(async (req, res) => {
  await dbConnect();
  if (req.method !== "POST")
    return errorHandler(res, 400, "Only POST Method is allowed");

  const user = await checkAuth(req);
  if (!user) return errorHandler(res, 401, "Login First");
  if(!user?.isSeller) return errorHandler(res,401,"Only Seller is allowed");

  const {title,desc,img,prices}=req.body
  
  if(!title||!desc||!img||!prices) return errorHandler(res, 400, "Please enter all fields");

  const product=await Product.create({
    ...req.body,
    userId:user._id
  })
  if(!product) return errorHandler(res,204,'New Product not added')
  res.status(200).json({
    success: true,
    message:'New Product added successfully',
  });
});
export default handler;