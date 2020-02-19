/** Defines a single book data in the YAML file. */
export interface DataBook {
  title: string;
  isbn: string;
  finished: string;
}

/** Defines a list of books per year. */
export interface BooksPerYear {
  year: string;
  read: DataBook[];
}

/** Defines the Book information saved in the database. */
export interface Book {
  id: string;
  title: string;
  subtitle: string;
  authors: string;
  publishedDate: string;
  categories: string;
  isbn: string;
  pageCount: string;
  bookLink: string;
  imageLink: string;
  yearRead: string;
  dateRead: string;
}

/** Defines a function that accepts a year and a book. */
export interface YearAndDataBookProcessor {
  (year: string, dataBook: DataBook): void;
};
