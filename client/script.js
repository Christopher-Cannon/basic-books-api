const output = document.querySelector("#app");
const getAllBooksBtn = document.querySelector("#get-all-books");
const getOneBookBtn = document.querySelector("#get-one-book");

function newElement(element, classList, content) {
  const elem = document.createElement(element);
  elem.classList = classList;
  elem.textContent = content;

  return elem;
}

async function getBooks(url) {
  
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`An error has occured: ${response.status}`);
  }

  return await response.json();
}

async function outputBooks() {
  let books = await getBooks("http://localhost:3000/api/books");

  output.textContent = "";

  let toWrite = newElement("div", "books-container", "");
  let link = "";
  let bookDetails = "";
  let title = "";
  let author = "";
  let image = "";

  for (const book of books) {
    link = newElement("a", "book-link", "");
    link.href = book.link;

    image = newElement("img", "book-image", "");
    image.src = book.imageLink;

    title = newElement("p", "book-title", book.title);
    author = newElement("p", "book-author", book.author);
    
    bookDetails = newElement("div", "book-details", "");
    bookDetails.appendChild(title);
    bookDetails.appendChild(author);

    link.appendChild(image);
    link.appendChild(bookDetails);

    toWrite.appendChild(link);
  }

  output.appendChild(toWrite);
}

async function outputSingleBook() {
  const id = Number(document.querySelector("#book-id").value);

  try {
    let book = await getBooks("http://localhost:3000/api/books/" + id);

    output.textContent = "";
  
    let toWrite = newElement("div", "book-container", "");

    let link = newElement("a", "book-link", "");
    link.href = book.link;
    
    let title = newElement("p", "book-title", book.title);
    let author = newElement("p", "book-author", book.author);
    let pages = newElement("p", "book-pages", "Page Count: " + book.pages);
    let country = newElement("p", "book-country", "Country: " + book.country);
    let language = newElement("p", "book-language", "Language: " + book.language);
    let year = newElement("p", "book-year", "Year: " + book.year);

    let bookDetails = newElement("div", "book-details", "");
    bookDetails.appendChild(title);
    bookDetails.appendChild(author);
    bookDetails.appendChild(pages);
    bookDetails.appendChild(country);
    bookDetails.appendChild(language);
    bookDetails.appendChild(year);

    let image = newElement("img", "book-image", "");
    image.src = book.imageLink;

    link.appendChild(image);
    link.appendChild(bookDetails);

    toWrite.appendChild(link);
    output.appendChild(toWrite);

  } catch (error) {
    console.error("Error: Could not retrieve book with id " + id);
  }
}

getAllBooksBtn.addEventListener("click", e => {
  e.preventDefault();

  outputBooks();
});

getOneBookBtn.addEventListener("click", e => {
  e.preventDefault();

  outputSingleBook();
})

// outputBooks();

