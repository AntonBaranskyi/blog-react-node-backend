import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidator } from "./validations/auth.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "./models/User.js";

mongoose
  .connect(
    "mongodb+srv://admin:pZ8578UjrsD7Ikra@cluster0.zcshjyp.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error " + err));

const app = express();

app.get("/", (req, resp) => {
  resp.send("Hello World!");
});

app.use(express.json()); // навчили node читать json

// app.post("/auth/login", (req, resp) => {
//   console.log(req.body); // відповідь юзера

//   const token = jwt.sign(
//     {
//       email: req.body.email,
//       name: "Anton Antonovich",
//     },
//     "secret123"
//   );
//   resp.json({
//     success: true, //відповідб сервера
//     token,
//   });
// });

app.post("/auth/login", async (req, resp) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return req.status(404).json({
        message: "Cannot find user",
      });
    }

    const isValidPassord = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPassord) {
      return req.status(404).json({
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
});
app.post("/auth/register", registerValidator, async (req, resp) => {
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
});

app.listen(3000, (err) => {
  if (err) {
    console.log("Error" + err);
  }

  console.log("Server OK!");
});
