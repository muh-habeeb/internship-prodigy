import { mongoose } from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
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
      console.log(chalk.bgMagenta(chalk.black("Database connected successfully"), chalk.bold(mongoose.connection.host)));
    })
    .catch((error) => {
      console.log(chalk.bgRed(chalk.white("mongodb not connected"), error.message, error));

      process.exit(1);
    });
};
