import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import PasswordResetModel from "../models/PasswordReset.model.js";
import { v4 as uuid } from "uuid";
import BrandModel from "../models/Brand.model.js";
import UserModel from "../models/User.model.js";

export const userLogin = async function (req, res, next) {
  const { email, password, userType } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(401).json({
      status: "error",
      message: "Please provide email and password",
    });
  }

  try {
    let user = null;
    if (userType === "brand") {
      user = await mongoose.connection.db
        .collection("brands")
        .findOne({ "poc.email": email });
    } else {
      user = await mongoose.connection.db
        .collection("users")
        .findOne({ email });
    }

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
        userType: user.userType || userType,
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
      message: error.message,
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
      .findOne({ "poc.email": email });

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
      message: error.message,
    });
  }
};

async function sendResetLink(user, req, res) {
  if (!user) {
    return;
  }
  const userType = user.userType;
  const domainURL = req.headers.referer;
  const resetToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.AUTH_KEY,
    { expiresIn: "1h" }
  );
  const resetLink = `${domainURL}reset-password/${resetToken}`;

  // Hash reset URI
  const hashedURI = await bcrypt.hash(resetLink, 10);
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: userType === "brand" ? user.poc.email : user.email,
    subject: "Password Reset",
    html: `<h2>Password Reset</h2><br></br><p>Click on the link to reset your password: ${resetLink}</p>`,
  };

  console.log(user, userType);

  try {
    await PasswordResetModel.create({
      _id: user._id,
      resetURI: hashedURI,
      email: userType === "brand" ? user.poc.email : user.email,
      userType: user.userType,
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

export async function requestPasswordReset(req, res) {
  const { email, userType } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Please provide a valid email",
    });
  }

  try {
    let user = null;
    await PasswordResetModel.deleteMany({ email });
    if (userType === "brand") {
      user = await mongoose.connection.db
        .collection("brands")
        .findOne({ "poc.email": email });
    } else {
      user = await mongoose.connection.db
        .collection("users")
        .findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    sendResetLink({ ...user, userType }, req, res);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function verifyResetToken(req, res) {
  const { token, uri } = req.query;
  const { userId } = jwt.verify(token, process.env.AUTH_KEY);

  if (!userId) {
    return res.status(400).json({
      status: "error",
      message: "Invalid token",
    });
  }

  const user = await PasswordResetModel.findOne({ _id: userId });
  console.log(userId, uri, user);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isTokenValid =
    (await bcrypt.compare(uri, user.resetURI)) &&
    new Date(user.expiresAt) > new Date();
  if (!isTokenValid) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }
  return res.status(200).json({
    status: "success",
    message: "Token verified",
  });
}

export async function resetPassword(req, res) {
  const { email, newPassword, userType } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      status: "error",
      message: "Please provide a valid email and password",
    });
  }

  try {
    let user = null;
    if (userType === "brand") {
      user = await mongoose.connection.db
        .collection("brands")
        .findOne({ "poc.email": email });
    } else {
      user = await mongoose.connection.db
        .collection("users")
        .findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    if (userType === "brand") {
      await BrandModel.updateOne(
        { "poc.email": email },
        {
          $set: {
            password: hashedPassword,
            updatedAt: new Date().toISOString(),
          },
        }
      );
    } else {
      await UserModel.updateOne(
        { email },
        {
          $set: {
            password: hashedPassword,
            updatedAt: new Date().toISOString(),
          },
        }
      );
    }
    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
