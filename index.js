import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidator } from "./validations/auth.js";
import { validationResult } from "express-validator";

mongoose
  .connect(
    "mongodb+srv://admin:pZ8578UjrsD7Ikra@cluster0.zcshjyp.mongodb.net/?retryWrites=true&w=majority"
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

app.post("/auth/register", registerValidator, (req, resp) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return resp.status(400).json(errors.array()); // поверни 400 і помилки
  }

  resp.json({
    success: true,
  });
});

app.listen(3000, (err) => {
  if (err) {
    console.log("Error" + err);
  }

  console.log("Server OK!");
});
