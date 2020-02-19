import fs = require("fs");
import Sqlite = require("better-sqlite3");

import {DATA_DIRECTORY_PATH, DATABASE_CONNECTION_STRING} from "./config";

/** Connects to the database and returns an instance of the database. */
export function connect(): Sqlite.Database {
  // Create the data directory if it doesn't exist yet.
  // TODO(njncalub): Create the directory on database creation error,
  // instead of checking it here.
  if (!fs.existsSync(DATA_DIRECTORY_PATH)) {
    fs.mkdirSync(DATA_DIRECTORY_PATH);
  }

  const db: Sqlite.Database = new Sqlite(DATABASE_CONNECTION_STRING, {
    verbose: console.log
  });
  
  return db;
}