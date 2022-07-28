import express from "express";
import mongoose from "mongoose";
import StudentModel from "../models/Student.model.js";

export const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await UserModel.findOne({ email });

    if (newUser) {
      return res.status(400).json({ message: "Student User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let finalData = req.body;
    finalData.userType = "admin";

    console.log(finalData, "fd");
    const result = await UserModel.create({
      ...finalData,
      _id: `IITP_ST_${uuid().replace(/-/g, "_")}`,
      password: hashedPassword,
    });

    console.log(result, "resultttt");

    res
      .status(200)
      .json({ result, message: "Student User created successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
