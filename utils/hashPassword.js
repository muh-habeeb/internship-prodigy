import bcrypt from "bcryptjs";

export const hashPasswordUsingBcrypt = async function (password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    return password;
};