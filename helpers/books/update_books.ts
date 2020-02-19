import fs = require("fs");
import superagent = require("superagent");
import yaml = require("yaml");
import Sqlite = require("better-sqlite3");

import {BOOKS_DATA_YAML_FILE, GOOGLE_BOOKS_API_URI} from "./config";
import {connect} from "./connection";
import {UPSERT_BOOK_QUERY} from "./queries";
import {Book, DataBook, BooksPerYear, YearAndDataBookProcessor} from "./models";

/** Runs the application. */
function run() {
  const db = connect();
  
  const booksData: BooksPerYear[] = parseBooksDataFile();
  const fetchAndSaveFunc = createFetchAndSaveFunc(db);
  
  upsertBooks(booksData, fetchAndSaveFunc);
}

/** Parses the books data from a file. */
function parseBooksDataFile(): BooksPerYear[] {
  const dataFile = fs.readFileSync(BOOKS_DATA_YAML_FILE, "utf8");
  const parsedData: BooksPerYear[] = yaml.parse(dataFile);
  
  return parsedData;
}

/** Creates a function that fetches the book information and saves it to the database. */
function createFetchAndSaveFunc(db: Sqlite.Database): YearAndDataBookProcessor {
  const insert = db.prepare(UPSERT_BOOK_QUERY);
  const insertTransaction = db.transaction((book: Book) => {
    insert.run(book);
  });
  
  return (year: string, book: DataBook) => {
    const q = `isbn:${encodeURI(book.isbn)}`;
    
    superagent.get(GOOGLE_BOOKS_API_URI)
      .query({ q })
      .end((err, res) => {
        if (err) { return console.log(err); }
        if (!res.body.items || res.body.items === 0) return;
      
        // Extract the data we need from the first search result.
        const item = res.body.items[0];
        const data: Book = {
          id: item.id,
          title: item.volumeInfo.title,
          subtitle: item.volumeInfo.subtitle,
          authors: JSON.stringify(item.volumeInfo.authors),
          publishedDate: item.volumeInfo.publishedDate,
          categories: JSON.stringify(item.volumeInfo.categories),
          isbn: JSON.stringify(item.volumeInfo.industryIdentifiers),
          pageCount: item.volumeInfo.pageCount,
          bookLink: item.volumeInfo.previewLink.replace(/^http\:\/\//g, "https://"),
          imageLink: item.volumeInfo.imageLinks.thumbnail.replace(/^http\:\/\//g, "https://"),
          yearRead: year,
          dateRead: book.finished,
        };

        insertTransaction(data);
      });
  };
}

/** Upserts all the books read. */
function upsertBooks(booksData: BooksPerYear[], fetchAndSaveFunc: YearAndDataBookProcessor) {
  // Iterate over all books read per year and save each book with their updated information.
  booksData.forEach((year) => {
    const booksRead = year.read || [];
    booksRead.forEach((book) => {
      fetchAndSaveFunc(year.year, book);
    })
  });
}

run();
