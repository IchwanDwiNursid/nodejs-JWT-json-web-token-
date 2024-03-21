const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

require("dotenv").config();

const PORT = 3000;

const generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_KEY, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY);
};

app.use(express.json());

app.post("/login", (req, res) => {
  try {
    const user = {
      name: "ichwan",
      password: "welcome",
      email: "ichwan@gmail",
    };

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: false,
    });
    res.json({
      message: "You succesfully Login",
    });
  } catch (err) {
    throw new Error("Error Happens");
  }
});

const cekToken = (req, res, next) => {
  const bearerHeader = req.get("Authorization");
  const token = bearerHeader.split(" ")[1];

  if (token) {
    verifyToken(token);
    next();
    return;
  } else {
    res.status(401).json({
      errors: "Invalid Token",
    });
  }
};

app.use(cekToken);

app.get("/secure", (req, res) => {
  res.status(200).json({
    message: "your account is secure",
  });
});
const errorMiddleware = (err, req, res, next) => {
  res.status(500).json({
    message: "Internal Server Error",
  });
};

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("App listen on port 3000");
});
