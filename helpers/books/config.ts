/** Location of where the database is stored. */
export const DATA_DIRECTORY_PATH = process.env.DATA_DIRECTORY || "./.data";

/** Name of the books database. */
export const BOOKS_DB_FILE = process.env.BOOKS_DB_FILE || "books.db";

/** Connection string to connect to the database. */
export const DATABASE_CONNECTION_STRING = `${DATA_DIRECTORY_PATH}/${BOOKS_DB_FILE}`;

/** Location of the books file relative to the package.json file. */
export const BOOKS_DATA_YAML_FILE = "./helpers/books/data.yaml";

/** Endpoint for the Google Books API - Volume querier. */
export const GOOGLE_BOOKS_API_URI = "https://www.googleapis.com/books/v1/volumes";
