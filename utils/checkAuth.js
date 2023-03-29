import jwt from "jsonwebtoken";

export default (req, resp, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, ""); // видалив Bearer

  if (token) {
    try {
      const decodedToken = jwt.verify(token, "secret123"); // розшифруання токену

      req.userId = decodedToken._id; //записав його в айді
      next(); // дозволив ф-ї йти далі
    } catch (error) {
      console.log(error);
      return resp.status(403).json({
        message: "No permission",
      });
    }
  } else {
    return resp.status(403).json({
      message: "No permission",
    });
  }
};
