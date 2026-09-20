import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [userData, setUserData] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const rowsPerPage = 10;
  const startIndex = (currPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currUserData = userData.slice(startIndex, endIndex);
  const totalPage = Math.ceil(userData.length / rowsPerPage);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json",
        );
        if (!response.ok) {
          throw new Error("Error while fetching the user data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUserData();
  }, []);
  useEffect(() => {
    console.log(userData);
  }, [userData]);

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

          <tbody>
            {currUserData.map((employee) => (
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
        </table>
      </section>

      <div className="mt-12 flex justify-center gap-5">
        <button
          className="rounded-md bg-[#009879] px-4 py-2 text-sm font-medium text-white cursor-pointer"
          disabled={currPage === 1}
          onClick={() => setCurrPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <button className="rounded-md bg-[#009879] px-4 py-2 text-sm font-medium text-white">
          1
        </button>

        <button
          className="rounded-md bg-[#009879] px-4 py-2 text-sm font-medium text-white cursor-pointer"
          disabled={currPage === totalPage}
          onClick={() => setCurrPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
