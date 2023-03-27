import { body } from "express-validator";

export const registerValidator = [
  body("email", "Invalid type of email").isEmail(),
  body("fullName", "This field should contain at least 3 symvols").isLength({
    min: 3,
  }),
  body("password", "This field should contain at least 5 symvols").isLength({
    min: 5,
  }),
  body("avatarUrl", "Wrong URl").optional().isURL(),
];
