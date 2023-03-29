import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const login = async (req, resp) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return resp.status(404).json({
        message: "Cannot find user",
      });
    }

    const isValidPassord = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPassord) {
      return resp.status(404).json({
        message: "Ivalid login or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    resp.json({
      ...user._doc,
      token,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Cannot login",
    });
  }
};

export const register = async (req, resp) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return resp.status(400).json(errors.array()); // поверни 400 і помилки
    }
    const { email, password, fullName, avatarUrl } = req.body;
    //Кодую пароль
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email,
      passwordHash,
      fullName,
      avatarUrl,
    });

    const user = await doc.save(); // сохранив в БД

    const token = jwt.sign(
      //створюю токен
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );

    resp.json({
      ...user._doc,
      token,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const checkMe = async (req, resp) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return resp.status(404).json({
        message: "Cannot find user",
      });
    }

    const { ...userData } = user._doc;

    resp.json(userData);
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Cannot find",
    });
  }
};
