const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// 📌 Task 10: Get all books (Using Async/Await)
public_users.get("/", async (req, res) => {
  try {
    let response = await axios.get("http://localhost:5000/books");
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// 📌 Task 11: Get book by ISBN (Using Promises)
public_users.get("/isbn/:isbn", (req, res) => {
  let isbn = req.params.isbn;

  axios
    .get(`http://localhost:5000/books/${isbn}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res
        .status(404)
        .json({ message: "Book not found", error: error.message });
    });
});

// 📌 Task 12: Get book by Author (Using Async/Await)
public_users.get("/author/:author", async (req, res) => {
  try {
    let author = req.params.author;
    let response = await axios.get("http://localhost:5000/books");
    let filteredBooks = Object.values(response.data).filter(
      (book) => book.author === author
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// 📌 Task 13: Get book by Title (Using Promises)
public_users.get("/title/:title", (req, res) => {
  let title = req.params.title;

  axios
    .get("http://localhost:5000/books")
    .then((response) => {
      let filteredBooks = Object.values(response.data).filter(
        (book) => book.title === title
      );
      if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "Error fetching books", error: error.message });
    });
});

// 📌 Get book reviews
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
