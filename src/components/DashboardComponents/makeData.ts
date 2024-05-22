export type Book = {
  [x: string]: unknown;
  title: string;
  author_name: string[];
  first_publish_year: number;
  ratings_average: number;
  subject: string[];
  birth_date: string;
  top_work: string;
};

export async function makeData(numBooks: number): Promise<Book[]> {
  try {
    const responseBooks = await fetch(
      `https://openlibrary.org/search.json?q=the&limit=${numBooks}`
    );
    if (!responseBooks.ok) {
      throw new Error("Network response was not ok");
    }
    const booksData = await responseBooks.json();

    // Fetch author data for each book's author
    const bookPromises = booksData.docs.map(async (doc: any) => {
      const authorName = doc.author_name?.[0];
      const responseAuthor = await fetch(
        `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(
          authorName
        )}`
      );
      if (!responseAuthor.ok) {
        throw new Error(`Network response for author ${authorName} was not ok`);
      }
      const authorData = await responseAuthor.json();
      const authorInfo = authorData?.docs[0];
      return {
        title: doc.title,
        author_name: doc.author_name,
        first_publish_year: doc.first_publish_year,
        ratings_average: doc.ratings_average,
        subject: doc.subject?.[0],
        birth_date: authorInfo.birth_date,
        top_work: authorInfo.top_work,
      };
    });

    // Wait for all book promises to resolve
    const booksWithAuthorData = await Promise.all(bookPromises);
    return booksWithAuthorData;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}
