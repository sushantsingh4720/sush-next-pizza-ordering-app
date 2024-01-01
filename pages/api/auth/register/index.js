import bcrypt from "bcrypt";
import dbConnect from "../../../../utils/mongo";
import { asyncError, errorHandler } from "../../../../middlewares/error";
import { cookieSetter, generateToken } from "../../../../utils/features";
import { User } from "../../../../models/user";

const handler = asyncError(async (req, res) => {
  if (req.method !== "POST")
    return errorHandler(res, 400, "Only POST Method is allowed");

  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return errorHandler(res, 400, "Please enter all fields");

  await dbConnect();

  let user = await User.findOne({ email });

  if (user) return errorHandler(res, 400, "User registered with this email");

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    ...req.body,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  cookieSetter(res, token, true);

  res.status(201).json({
    success: true,
    message: "Registered Successfully",
    user,
  });
});

export default handler;
