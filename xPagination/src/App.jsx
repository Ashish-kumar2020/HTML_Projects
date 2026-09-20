import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);

        const response = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json",
        );

        if (!response.ok) {
          throw new Error("Error while fetching the user data");
        }

        const data = await response.json();

        setUserData(data);
      } catch (error) {
        alert("Error while fetching the user data");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  // Pagination
  const totalPages = Math.ceil(userData.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentUsers = userData.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen px-7 py-10">
      {/* Heading */}
      <h1 className="text-center text-3xl font-bold">Employee Data Table</h1>

      {/* Table */}
      <section className="mt-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="h-11 bg-[#009879] text-white">
              <th className="px-4 text-left">ID</th>
              <th className="px-4 text-left">Name</th>
              <th className="px-4 text-left">Email</th>
              <th className="px-4 text-left">Role</th>
            </tr>
          </thead>

          {loading ? (
            <tbody>
              {Array.from({ length: rowsPerPage }).map((_, index) => (
                <tr key={index} className="h-[47px] border-b border-gray-200">
                  <td className="px-4">
                    <div className="h-4 w-6 animate-pulse rounded bg-gray-200" />
                  </td>

                  <td className="px-4">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  </td>

                  <td className="px-4">
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                  </td>

                  <td className="px-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {currentUsers.map((employee) => (
                <tr
                  key={employee.id}
                  className="h-[47px] border-b border-gray-200"
                >
                  <td className="px-4">{employee.id}</td>

                  <td className="px-4">{employee.name}</td>

                  <td className="px-4">{employee.email}</td>

                  <td className="px-4">{employee.role}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </section>

      {/* Pagination */}
      {!loading && (
        <div className="mt-12 flex items-center justify-center gap-5">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="rounded-md bg-[#009879] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-medium">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="rounded-md bg-[#009879] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
