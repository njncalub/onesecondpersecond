/**
 * Fetches book information from Google Books API and populates the database.
 */

const fs = require("fs");
const Database = require("better-sqlite3");

/**
 * Creates the books table if it doesn't exist.
 *
 * TODO(njncalub): Move to a separate file.
 */
const qInitBooksTable = `
  CREATE TABLE IF NOT EXISTS books (
    isbn TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    image_uri TEXT NOT NULL
  );
`;

/**
 * Selects all the books from the database.
 *
 * TODO(njncalub): Move to a separate file.
 */
const qSelectBooks = `
  SELECT
    isbn,
    title,
    author,
    image_uri
  FROM
    books;
`;

/**
 * Inserts a book to the database.
 *
 * TODO(njncalub): Move to a separate file.
 */
const qInsertBook = `
  INSERT INTO books (
    isbn,
    title,
    author,
    image_uri
  )
  VALUES (
    @isbn,
    @title,
    @author,
    @image_uri
  );
`;

const DATA_DIRECTORY = process.env.DATA_DIRECTORY || "./.data";
const BOOKS_DB = process.env.BOOKS_DB || "books.db";

function run() {
  const db = init();
  
  const booksList = db.prepare(qSelectBooks).all();
  console.log(booksList);
}

function init() {
  // Create the data directory if it doesn't exist yet.
  // TODO(njncalub): Create the directory on database creation error,
  // instead of checking it here.
  if (!fs.existsSync(DATA_DIRECTORY)) {
    fs.mkdirSync(DATA_DIRECTORY);
  }

  const db = new Database(`${DATA_DIRECTORY}/${BOOKS_DB}`, {
    verbose: console.log
  });
  
  // Initialize tables.
  db.prepare(qInitBooksTable).run();
  
  return db;
}

run();