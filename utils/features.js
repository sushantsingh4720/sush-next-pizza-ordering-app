import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export const cookieSetter = (res, token, set) => {
  res.setHeader(
    "Set-Cookie",
    serialize("token", set ? token : "", {
      path: "/",
      httpOnly: true,
      maxAge: set ? 15 * 24 * 60 * 60 * 1000 : 0,
    })
  );
};

export const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET);
};

export const checkAuth = async (req) => {
  const cookie = req.headers.cookie;
  if (!cookie) return null;

  const token = extractToken(cookie)

  if(!token) return null;
 
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return await User.findById(decoded._id);
};


function extractToken(inputString) {
  // Use a regular expression to match "token=" followed by the value
  const match = inputString.match(/(?:^|\s)token=([^;]+)/);

  // Check if a match is found
  if (match && match[1]) {
      // Return the captured token value
      return match[1];
  }

  // If "token" is not present or no valid token is found, return null
  return null;
}