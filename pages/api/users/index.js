import dbConnect from "../../../util/mongo";

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  if (method === "POST") {
    console.log(res);
    try {
      res
        .setHeader(
          "Set-Cookie",
          serialize("token", true ? "hjjjjjjjjjjjjjj" : "", {
            path: "/",
            httpOnly: true,
            maxAge: set ? 15 * 24 * 60 * 60 * 1000 : 0,
          })
        )
        .status(200)
        .json({ success: true, message: "Login successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  if (method === "POST") {
    try {
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

export default handler;
