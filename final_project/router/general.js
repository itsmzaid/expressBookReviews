const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
const public_users = express.Router();

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    let isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  try {
    let author = req.params.author;
    let filteredBooks = Object.values(books).filter(
      (book) => book.author === author
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res
        .status(404)
        .json({ message: "Books not found for this author" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error fetching books by author",
        error: error.message,
      });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  try {
    let title = req.params.title;
    let filteredBooks = Object.values(books).filter(
      (book) => book.title === title
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res
        .status(404)
        .json({ message: "Books not found for this title" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books by title", error: error.message });
  }
});

// Get book review
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
