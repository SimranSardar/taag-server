import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import PasswordResetModel from "../models/PasswordReset.model.js";

export const userLogin = async function (req, res, next) {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(401).json({
      status: "error",
      message: "Please provide email and password",
    });
  }

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
        userType: user.userType,
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

export const brandLogin = async function (req, res, next) {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(401).json({
      status: "error",
      message: "Please provide email and password",
    });
  }

  try {
    const user = await mongoose.connection.db
      .collection("brands")
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
        userType: user.userType,
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

async function sendResetLink(user, req, res) {
  if (!user) {
    return;
  }
  const domainURL = req.get("host");
  const resetLink = `${domainURL}/reset-password/${user._id}`;

  // Hash reset URI
  const hashedURI = await bcrypt.hash(resetLink, 10);
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: user.poc.email,
    subject: "Password Reset",
    html: `<h1>Password Reset</h1><br></br><p>Click on the link to reset your password: ${resetLink}</p>`,
  };

  try {
    await PasswordResetModel.create({
      _id: user._id,
      resetURI: hashedURI,
      email: user.poc.email,
      userType: user.userType || "brand",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
      },
    });

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "error",
          message: err.message,
        });
      } else {
        return res.status(200).json({
          status: "success",
          message: "Reset link sent",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function requestPasswordResetBrand(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Please provide a valid email",
    });
  }

  try {
    const user = await mongoose.connection.db
      .collection("brands")
      .findOne({ "poc.email": email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    sendResetLink(user, req, res);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
