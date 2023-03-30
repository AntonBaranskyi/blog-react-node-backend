import express from "express";
import mongoose from "mongoose";
import checkAuth from "./utils/checkAuth.js";
import { login, register, checkMe } from "./controllers/UserController.js";
import multer from "multer";
import {
  registerValidator,
  loginValidator,
  postValidator,
} from "./validations.js";
import {
  create,
  deletePost,
  getAll,
  getOne,
  update,
} from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://admin:pZ8578UjrsD7Ikra@cluster0.zcshjyp.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error " + err));

const app = express();

const storage = multer.diskStorage({
  //шлях куди зберігати картинки
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    // називаємо файл
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json()); // навчили node читать json

app.post("/auth/login", loginValidator, login);
app.post("/auth/register", registerValidator, register);
app.get("/auth/me", checkAuth, checkMe);

app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.post("/posts", checkAuth, postValidator, create);
app.delete("/posts/:id", checkAuth, deletePost);
app.patch("/posts/:id", checkAuth, update);

app.post("/uploads", upload.single("image"), (req, resp) => {
  resp.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(3000, (err) => {
  if (err) {
    console.log(`Error: ${err}}`);
  }

  console.log("Server OK!");
});
