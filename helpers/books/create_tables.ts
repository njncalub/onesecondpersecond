import {connect} from "./connection";
import {CREATE_BOOKS_TABLE_QUERY} from "./queries";

/** Runs the application. */
function run() {
  const db = connect();
  
  db.prepare(CREATE_BOOKS_TABLE_QUERY).run();
  
  db.close();
}

run();
