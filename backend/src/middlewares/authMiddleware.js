import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token = req.headers.authorization;
  const JWT_SECRET = "myverystrongsecretkey"

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1]; // Extract actual token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Attach user data to request
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  }

  return res.status(401).json({ message: "No token provided, authorization denied." });
};
