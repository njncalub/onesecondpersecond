const fs = require("fs");
const Database = require("better-sqlite3");

const DATA_DIRECTORY = process.env.DATA_DIRECTORY || "./.data";
const BOOKS_DB = process.env.BOOKS_DB || "books.db";

// TODO(ncalub): Move queries to a different module.
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
const Q_SELECT_BOOKS = `
  SELECT
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
  FROM
    books;
`;

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

module.exports = function() {
  const db = connect();
  const books = db.prepare(Q_SELECT_BOOKS).all();
  
  db.close();
  
  return books;
};