const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username password are required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  let accessToken = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  return res
    .status(200)
    .json({ message: "Login successful", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let { review } = req.body;
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Authentication token required" });
  }

  try {
    let decoded = jwt.verify(token.split(" ")[1], "secret_key");
    let username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews,
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Authentication token required" });
  }

  try {
    let decoded = jwt.verify(token.split(" ")[1], "secret_key");
    let username = decoded.username;

    if (
      !books[isbn] ||
      !books[isbn].reviews ||
      !books[isbn].reviews[username]
    ) {
      return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
