"use client"

import { useState, useEffect } from "react";

// ข้อมูลจำลองสำหรับตาราง
const mockData = [
  { id: 1, name: "Alice", age: 25, department: "Engineering" },
  { id: 2, name: "Bob", age: 30, department: "Design" },
  { id: 3, name: "Charlie", age: 28, department: "Marketing" },
  { id: 4, name: "David", age: 22, department: "HR" },
  { id: 5, name: "Eve", age: 27, department: "Engineering" },
  // เพิ่มข้อมูลเพิ่มเติมได้ตามต้องการ
];

export default function DataTable() {
  const [data, setData] = useState(mockData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  // การกรองข้อมูลด้วย searchTerm
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // การจัดเรียงข้อมูล
  const sortedData = [...filteredData].sort((a, b) => {
    const key = sortConfig.key as keyof typeof a; // บอก TypeScript ว่า key นี้จะเป็นคีย์ของ a
    
    if (a[key] < b[key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
  

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key:any) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full px-3 py-2 border rounded-md"
      />

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th
              className="cursor-pointer px-4 py-2 border-b"
              onClick={() => handleSort("name")}
            >
              Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="cursor-pointer px-4 py-2 border-b"
              onClick={() => handleSort("age")}
            >
              Age {sortConfig.key === "age" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="cursor-pointer px-4 py-2 border-b"
              onClick={() => handleSort("department")}
            >
              Department {sortConfig.key === "department" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{item.name}</td>
              <td className="px-4 py-2 border-b">{item.age}</td>
              <td className="px-4 py-2 border-b">{item.department}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Previous
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
