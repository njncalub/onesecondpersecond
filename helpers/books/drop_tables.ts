/**
 * Fetches book information from Google Books API and populates the database.
 */

const fs = require("fs");
const Database = require("better-sqlite3");

const DATA_DIRECTORY = process.env.DATA_DIRECTORY || "./.data";
const BOOKS_DB = process.env.BOOKS_DB || "books.db";

// TODO(ncalub): Move queries to a different module.
const Q_DROP_BOOKS_TABLE = `DROP TABLE books;`;

/** Runs the application. */
function run() {
  const db = connect();
  
  db.prepare(Q_DROP_BOOKS_TABLE).run();
  
  db.close();
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
  
  return db;
}

run();