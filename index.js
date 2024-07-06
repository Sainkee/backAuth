import express from "express";

const app = express();
const PORT = 8082;

app.use(express.json());

const errorHandlingMiddleware = (err, req, res, next) => {
  console.log(err);
  res.status(400).json({ error: err.message });
};

const validateRegistrationData = (req, res, next) => {
  const { firstName, lastName, phone, password, email } = req.body;

  const nameRegex = /^[A-Z][a-z]*$/;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    return next(
      new Error("First and last name must start with a capital letter.")
    );
  }

  // Validate Password
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return next(
      new Error(
        "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
      )
    );
  }

  // Validate Email Address
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return next(new Error("Invalid email address."));
  }

  // Validate Phone Number
  const phoneRegex = /^\d{10,}$/;
  if (!phoneRegex.test(phone)) {
    return next(new Error("Phone number must be at least 10 digits long."));
  }

  next();
};

app.post("/register", validateRegistrationData, (req, res) => {
  res.status(200).json({ message: "User registered successfully!" });
});
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
