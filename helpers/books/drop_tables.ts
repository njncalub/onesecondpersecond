import {connect} from "./connection";
import {DROP_BOOKS_TABLE_QUERY} from "./queries";

/** Runs the application. */
function run() {
  const db = connect();
  
  db.prepare(DROP_BOOKS_TABLE_QUERY).run();

  db.close();
}

run();
