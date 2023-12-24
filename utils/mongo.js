import mongoose from "mongoose";
const dbConnect = () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGO_URL);
  mongoose.set("runValidators", true);
  mongoose.connection.on("connected", () => {
    console.log("Connected to Mongoose Server");
  });
  mongoose.connection.on("error", () => {
    console.log("`Error connecting to Mongoose server: ${err.message}`");
  });
  mongoose.connection.on("disconnect", () => {
    console.log("Disconnected from Mongoose Server");
  });
};
export default dbConnect;
