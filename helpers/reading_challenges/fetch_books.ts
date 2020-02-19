/**
 * Fetches book information from Google Books API and populates the database.
 */

const fs = require("fs");
const yaml = require("yaml");
const Database = require("better-sqlite3");
const superagent = require("superagent");

const DATA_DIRECTORY = process.env.DATA_DIRECTORY || "./.data";
const BOOKS_DB = process.env.BOOKS_DB || "books.db";

const GOOGLE_BOOKS_API_URI = "https://www.googleapis.com/books/v1/volumes";

// TODO(ncalub): Move queries to a different module.
const Q_DROP_BOOKS_TABLE = `DROP TABLE books;`;
const Q_INIT_BOOKS_TABLE = `
  CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    authors TEXT NOT NULL,
    published_date TEXT NOT NULL,
    categories TEXT NOT NULL,
    isbn TEXT NOT NULL,
    page_count TEXT NOT NULL,
    book_link TEXT NOT NULL,
    image_link TEXT NOT NULL,
    year_read TEXT NOT NULL
  );
`;
const Q_INSERT_BOOK = `
  INSERT INTO books (
    id,
    title,
    subtitle,
    authors,
    published_date,
    categories,
    isbn,
    page_count,
    book_link,
    image_link,
    year_read
  )
  VALUES (
    @id,
    @title,
    @subtitle,
    @authors,
    @publishedDate,
    @categories,
    @isbn,
    @pageCount,
    @bookLink,
    @imageLink,
    @yearRead
  )
  ON CONFLICT(id) DO UPDATE SET
    title=@title,
    subtitle=@subtitle,
    authors=@authors,
    published_date=@publishedDate,
    categories=@categories,
    isbn=@isbn,
    page_count=@pageCount,
    book_link=@bookLink,
    image_link=@imageLink,
    year_read=@yearRead;
`;

/** Runs the application. */
function run() {
  const db = connect();
  
  upsertReadBooks(db);
}

/** Connects to the database and returns an instance of the database. */
function connect() {
  // Create the data directory if it doesn't exist yet.
  // TODO(njncalub): Create the directory on database creation error,
  // instead of checking it here.
  if (!fs.existsSync(DATA_DIRECTORY)) {
    fs.mkdirSync(DATA_DIRECTORY);
  }

  const db = new Database(`${DATA_DIRECTORY}/${BOOKS_DB}`, {
    verbose: console.log
  });
  
  // NOTE(ncalub): Uncomment to drop tables.
  // db.prepare(Q_DROP_BOOKS_TABLE).run();
  
  // Initialize tables.
  db.prepare(Q_INIT_BOOKS_TABLE).run();
  
  return db;
}

/** Upserts all the books read. */
function upsertReadBooks(db) {
  const sInsertBook = db.prepare(Q_INSERT_BOOK);
  const insertBook = db.transaction((book) => {
    sInsertBook.run(book);
  });
  
  const dataFile = fs.readFileSync("./helpers/reading_challenges/data.yaml", "utf8");
  const parsedData = yaml.parse(dataFile);
  
  // Iterate over all books read per year and save each book with their updated information.
  parsedData.forEach((year) => {
    const booksRead = year.read || [];
    booksRead.forEach((bookRead) => {
      fetchAndSave(year.year, bookRead.isbn, insertBook);
    })
  });
}

/** Fetches the book information and saves it to the database. */
function fetchAndSave(yearRead, isbn, insertBook) {
  const q = `isbn:${encodeURI(isbn)}`;
  return superagent.get(GOOGLE_BOOKS_API_URI)
    .query({ q })
    .end((err, res) => {
      if (err) { return console.log(err); }
    
      if (!res.body.items || res.body.items === 0) return;
      const book = res.body.items[0];
    
      // Extract the data we need.
      const id = book.id;
      const title = book.volumeInfo.title;
      const subtitle = book.volumeInfo.subtitle;
      const authors = JSON.stringify(book.volumeInfo.authors);
      const publishedDate = book.volumeInfo.publishedDate;
      const categories = JSON.stringify(book.volumeInfo.categories);
      const isbn = JSON.stringify(book.volumeInfo.industryIdentifiers);
      const pageCount = book.volumeInfo.pageCount;
      const bookLink = book.selfLink;
      const imageLink = book.volumeInfo.imageLinks.thumbnail;
    
      const data = {
        id,
        title,
        subtitle,
        authors,
        publishedDate,
        categories,
        isbn,
        pageCount,
        bookLink,
        imageLink,
        yearRead,
      };
    
      insertBook(data);
    });
}

run();