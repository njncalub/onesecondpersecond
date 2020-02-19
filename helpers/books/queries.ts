/** Drop the `books` table. */
export const DROP_BOOKS_TABLE_QUERY = `
  DROP TABLE books;
`;

/** Create the `books` table. */
export const CREATE_BOOKS_TABLE_QUERY = `
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
    year_read TEXT NOT NULL,
    date_read TEXT NOT NULL
  );
`;

/** Upsert a book to the `books` table. */
export const UPSERT_BOOK_QUERY = `
  INSERT INTO books (
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
    year_read,
    date_read
  )
  VALUES (
    @id,
    @title,
    @subtitle,
    @authors,
    @publishedDate,
    @categories,
    @isbn,
    @pageCount,
    @bookLink,
    @imageLink,
    @yearRead,
    @dateRead
  )
  ON CONFLICT(id) DO UPDATE SET
    title=@title,
    subtitle=@subtitle,
    authors=@authors,
    published_date=@publishedDate,
    categories=@categories,
    isbn=@isbn,
    page_count=@pageCount,
    book_link=@bookLink,
    image_link=@imageLink,
    year_read=@yearRead,
    date_read=@dateRead;
`;
