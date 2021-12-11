const books = require("./books.json");

let counter = 1;

for (const book of books) {
  book.id = counter;
  counter++;
}

console.log(JSON.stringify(books));