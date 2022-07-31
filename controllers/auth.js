import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const userLogin = async function (req, res, next) {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(401).json({
      status: "error",
      message: "Please provide email and password",
    });
  }

  // if (email === "admin@email.com" && password === "password") {
  //   const token = jwt.sign(
  //     {
  //       email,
  //       id: "ABC123",
  //     },
  //     process.env.AUTH_KEY,
  //     { expiresIn: "7d" }
  //   );

  //   return res.status(200).json({
  //     status: "success",
  //     token,
  //   });
  // }

  try {
    const user = await mongoose.connection.db
      .collection("users")
      .findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        email,
        id: user._id,
      },
      process.env.AUTH_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      status: "ok",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "erorr",
      message: "server error",
    });
  }
};
