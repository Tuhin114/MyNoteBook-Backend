const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");

const JWT_SECRET = "Tuhinisagoodb$oy";

// Create a User using: POST "/api/auth/createuser". No login required.
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //if there are errors, return Bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).send("A user with that email already exists");
      }

      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);

      //Create new user
      user = await User.create({
        name: req.body.name, // Change req.body.username to req.body.name
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user._id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      // res.json(user);
      res.json({ authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// Authenticate a User using: POST "/api/auth/login". No login required.
router.post(
  "/login",
  [body("email", "Enter a valid email").isEmail()],
  [body("password", "Password can't be blank").exists()],
  async (req, res) => {
    //if there are errors, return Bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .send("Please try to login with correct credentials");
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ errors: errors.array() });
      }

      const data = {
        user: {
          id: user._id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
