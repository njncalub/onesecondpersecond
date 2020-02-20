const queries = require("helpers_js/books/queries");
const connection = require("helpers_js/books/connection");

module.exports = function() {
  const db = connection.connect();
  
  // Initialize the database if doesn't exist.
  db.prepare(queries.CREATE_BOOKS_TABLE_QUERY).run();
  
  const books = db.prepare(queries.SELECT_BOOKS_QUERY).all();
  
  db.close();
  
  return books;
};