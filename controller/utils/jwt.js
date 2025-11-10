import dotenv from "dotenv"
dotenv.config();
import jwt from "jsonwebtoken";



const JWT_SECRET = process.env.JWT_SECRET;
export const setToken = (res, payload) => {
    const token = jwt.sign( payload , JWT_SECRET, { expiresIn: "3d" }); //obj payload
    res
        .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
            domain:
                process.env.NODE_ENV === "production"
                    ? process.env.JWT_DOMAIN
                    : "localhost",
        })
        .status(203);
    return token;
};
