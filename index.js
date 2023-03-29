import express from "express";
import mongoose from "mongoose";
import { registerValidator } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import { login, register, checkMe } from "./controllers/UserController.js";

mongoose
  .connect(
    "mongodb+srv://admin:pZ8578UjrsD7Ikra@cluster0.zcshjyp.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error " + err));

const app = express();

app.use(express.json()); // навчили node читать json

app.post("/auth/login", login);
app.post("/auth/register", registerValidator, register);
app.get("/auth/me", checkAuth, checkMe);

app.listen(3000, (err) => {
  if (err) {
    console.log("Error" + err);
  }

  console.log("Server OK!");
});
