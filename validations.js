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

export const loginValidator = [
  body("email", "Invalid type of email").isEmail(),
  body("password", "This field should contain at least 5 symvols").isLength({
    min: 5,
  }),
];

export const postValidator = [
  body("title", "Text title of your post").isLength({ min: 3 }).isString(),
  body("text", "Text your text").isLength({ min: 3 }).isString(),
  body("tags", "Invalid type of tags (choose array)").optional().isArray(),
  body("imageUrl", "Invalid src").optional().isString(),
];
