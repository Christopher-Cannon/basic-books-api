const Joi = require("joi");
const books = require("./books-testing.json");
const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();

// Temporary auto-incrementer for new book ids
let incrementer = books.length + 1;

function validateBook(book) {
  let currentYear = new Date().getFullYear();

  const schema = Joi.object({
    author: Joi.string().trim().default("Unknown"),
    country: Joi.string().trim().default("Unknown"),
    imageLink: Joi.string().default(null),
    language: Joi.string().alphanum().trim().required(),
    link: Joi.string().default(null),
    pages: Joi.number().integer().min(10).max(5000).required(),
    title: Joi.string().trim().required(),
    year: Joi.number().integer().max(currentYear).required(),
    id: Joi.number().integer().default(incrementer)
  });
  incrementer++;

  return schema.validate(book);
}

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
)
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Books API demo");
});

app.get("/api/books", (req, res) => {
  res.send(books);
});

app.post("/api/books", (req, res) => {
  const { error, value } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  books.push(value);
  
  res.send(value);
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find(book => book.id === Number(req.params.id));
  if (!book) return res.status(404).send(`Could not find book with id ${req.params.id}`);

  res.send(book);
});

app.put("/api/books/:id", (req, res) => {
  const book = books.find(book => book.id === Number(req.params.id));
  if (!book) return res.status(404).send(`Could not find book with id ${req.params.id}`);

  const { error, value } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  for (const key in book) {
    if (key !== "id") book[key] = value[key];
  }

  res.send(book);
});

app.delete("/api/books/:id", (req, res) => {
  const book = books.find(book => book.id === Number(req.params.id));
  if (!book) return res.status(404).send(`Could not find book with id ${req.params.id}`);

  const index = books.indexOf(book);
  books.splice(index, 1);

  res.send(book);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));