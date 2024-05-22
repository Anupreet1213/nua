import { ChangeEvent, useState } from "react";
import { Book } from "./makeData";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { Bars } from "react-loader-spinner";
import { saveAs } from "file-saver";

interface PaginationProps {
  books: Book[];
}

const Pagination: React.FC<PaginationProps> = ({ books }) => {
  const [visibleRows, setVisibleRows] = useState(10);
  const [startingIndex, setStartingIndex] = useState(0);
  const [endingIndex, setEndingIndex] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Book | null>(null);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | "RANDOM">(
    "RANDOM"
  );

  const parseDate = (dateString: string): number => {
    if (dateString.includes("A.D.")) {
      const year = parseInt(dateString.replace(" A.D.", ""), 10);
      return new Date(year, 0, 1).getTime();
    }

    const parsedDate = Date.parse(dateString);
    if (!isNaN(parsedDate)) {
      return parsedDate;
    }

    const yearOnly = parseInt(dateString, 10);
    if (!isNaN(yearOnly)) {
      return new Date(yearOnly, 0, 1).getTime();
    }

    return 0;
  };

  const nextRows = () => {
    if (endingIndex <= books.length) {
      setStartingIndex((prev) => prev + visibleRows);
      setEndingIndex((prev) => prev + visibleRows);
      setCurrentPage((prev) => prev + 1);
    }
  };
  const prevRows = () => {
    if (startingIndex > 0) {
      setStartingIndex((prev) => prev - visibleRows);
      setEndingIndex((prev) => prev - visibleRows);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const gotoFirstPage = () => {
    setStartingIndex(0);
    setEndingIndex(visibleRows);
    setCurrentPage(1);
  };

  const gotoLastPage = () => {
    const totalBooks = books.length;
    const lastPageStartIndex = Math.max(totalBooks - visibleRows, 0);
    setStartingIndex(lastPageStartIndex);
    setEndingIndex(totalBooks);
    setCurrentPage(Math.ceil(totalBooks / visibleRows));
  };

  const handleSort = (column: keyof Book) => {
    if (sortBy === column) {
      setSortOrder((prev) =>
        prev === "ASC" ? "DESC" : prev === "DESC" ? "RANDOM" : "ASC"
      );
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy) {
      let aValue;
      let bValue;
      if (sortBy === "author_name") {
        aValue = a[sortBy][0];
        bValue = b[sortBy][0];
      } else if (sortBy === "birth_date") {
        aValue = a[sortBy] ? parseDate(a[sortBy]) : -Infinity;
        bValue = b[sortBy] ? parseDate(b[sortBy]) : -Infinity;
      } else {
        aValue = a[sortBy];
        bValue = b[sortBy];
      }
      console.log(aValue, bValue);

      if (sortOrder === "RANDOM") {
        return 0;
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "ASC"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "ASC" ? aValue - bValue : bValue - aValue;
      } else {
        return 0;
      }
    }
    return 0;
  });

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setVisibleRows(parseInt(e.target.value));
    setEndingIndex(parseInt(e.target.value));
  };

  const handleDownloadCSV = () => {
    const csvData = books
      .map((book) => {
        // Customize the columns and their order as needed
        return [
          book.title,
          book.author_name.join(", "),
          book.first_publish_year,
          book.subject,
          book.birth_date,
          book.top_work,
          book.ratings_average,
        ];
      })
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "books.csv");
  };

  return (
    <>
      {books.length === 0 ? (
        <div className="flex justify-center">
          <Bars
            height="80"
            width="80"
            color="black"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <>
          <thead className="text-left">
            <th
              className="bg-black text-white p-2"
              onClick={() => handleSort("title")}
            >
              Title{" "}
              {sortBy === "title"
                ? sortOrder === "ASC"
                  ? "↑"
                  : sortOrder === "DESC"
                  ? "↓"
                  : ""
                : ""}
            </th>
            <th
              className="bg-black text-white"
              onClick={() => handleSort("author_name")}
            >
              Author{" "}
              {sortBy === "author_name"
                ? sortOrder === "ASC"
                  ? "↑"
                  : sortOrder === "DESC"
                  ? "↓"
                  : ""
                : ""}
            </th>
            <th
              className="bg-black text-white"
              onClick={() => handleSort("first_publish_year")}
            >
              Publish Year{" "}
              {sortBy === "first_publish_year"
                ? sortOrder === "ASC"
                  ? "↑"
                  : sortOrder === "DESC"
                  ? "↓"
                  : ""
                : ""}
            </th>
            <th
              className="bg-black text-white"
              onClick={() => handleSort("subject")}
            >
              Subject
              {sortBy === "subject"
                ? sortOrder === "ASC"
                  ? "↑"
                  : sortOrder === "DESC"
                  ? "↓"
                  : ""
                : ""}
            </th>
            <th
              className="bg-black text-white"
              onClick={() => handleSort("birth_date")}
            >
              DOB
              {sortBy === "birth_date"
                ? sortOrder === "ASC"
                  ? "↑"
                  : sortOrder === "DESC"
                  ? "↓"
                  : ""
                : ""}
            </th>
            <th
              className="bg-black text-white"
              onClick={() => handleSort("top_work")}
            >
              Top Work
              {sortBy === "top_work"
                ? sortOrder === "ASC"
                  ? "↑"
                  : sortOrder === "DESC"
                  ? "↓"
                  : ""
                : ""}
            </th>
            <th
              className="bg-black text-white"
              onClick={() => handleSort("ratings_average")}
            >
              Average Rating
              {sortBy === "ratings_average"
                ? sortOrder === "ASC"
                  ? "↑"
                  : sortOrder === "DESC"
                  ? "↓"
                  : ""
                : ""}
            </th>
          </thead>
          <tbody className="">
            {sortedBooks?.slice(startingIndex, endingIndex)?.map((book) => {
              return (
                <tr key={book.title}>
                  <td className="border border-black">{book.title}</td>
                  <td className="border border-black">{book.author_name}</td>
                  <td className="border border-black">
                    {book.first_publish_year}
                  </td>
                  <td className="border border-black">{book.subject}</td>
                  <td className="border border-black">
                    {book.birth_date ? book.birth_date : "-"}
                  </td>
                  <td className="border border-black">{book.top_work}</td>
                  <td className="border border-black">
                    {book.ratings_average
                      ? book.ratings_average?.toFixed(2)
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <div className="flex gap-3 items-center mt-4">
            <button
              disabled={startingIndex <= 0}
              className={`${
                startingIndex <= 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black"
              } py-2 px-4 rounded-md text-white`}
              onClick={gotoFirstPage}
            >
              <BiFirstPage />
            </button>
            <button
              disabled={startingIndex <= 0}
              className={`${
                startingIndex <= 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black"
              } py-2 px-4 rounded-md text-white`}
              onClick={prevRows}
            >
              <MdNavigateBefore />
            </button>
            <span className="min-w-10">
              {currentPage} of {Math.ceil(books.length / visibleRows)}
            </span>
            <button
              disabled={endingIndex > books.length - 1}
              className={`${
                endingIndex > books.length - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black"
              } py-2 px-4 rounded-md text-white`}
              onClick={nextRows}
            >
              <MdNavigateNext />
            </button>
            <button
              disabled={endingIndex > books.length - 1}
              className={`${
                endingIndex > books.length - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black"
              } py-2 px-4 rounded-md text-white`}
              onClick={gotoLastPage}
            >
              <BiLastPage />
            </button>
            <select name="" id="" onChange={handleSelectChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <button
              className="bg-black text-white rounded-md hover:bg-white hover:text-black hover:border hover:border-black transition-colors"
              onClick={handleDownloadCSV}
            >
              Download CSV
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Pagination;
