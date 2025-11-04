import { mongoose } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI;
if (!uri) {
  console.log("no database uri provided ");
  process.exit(1);
}

export const connectDb = async () => {
  await mongoose
    .connect(uri)
    .then(() => {
      console.log("Database connected successfully", mongoose.connection.host);
    })
    .catch((error) => {
      console.log("mongodb not connected", error.message, error);

      process.exit(1);
    });
};
