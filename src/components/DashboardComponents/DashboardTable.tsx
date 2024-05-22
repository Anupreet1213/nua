import { useEffect, useState } from "react";
import { Book, makeData } from "./makeData";
import Pagination from "./Pagination";

const DashboardTable = () => {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await makeData(100);
      setBooks(data);
    };

    fetchData();
  }, []);
  return (
    <div className="">
      <table className="w-full">
        {/* <tbody> */}
        <Pagination books={books} />
        {/* </tbody> */}
      </table>
    </div>
  );
};

export default DashboardTable;
