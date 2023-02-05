import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { address  } = req.body;

  try {
    const oldUser = await UserModel.findOne({ walletAddress: address });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const token = jwt.sign({ walletAddress: oldUser.address }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, userName, address, bio, interests } = req.body;

  try {
    const oldUser = await UserModel.findOne({ walletAddress: address });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const result = await UserModel.create({ email, userName, walletAddress: address, bio, interests });

    const token = jwt.sign( { walletAddress: address }, secret, { expiresIn: "1h" } );

    console.log("Here");

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};
