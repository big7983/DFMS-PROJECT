import React, { useState } from "react";

const users = [
  { id: 1, name: "John Doe", department: "HR" },
  { id: 2, name: "Jane Smith", department: "Finance" },
  { id: 3, name: "Alice Johnson", department: "IT" },
];

const departments = ["All", "HR", "Finance", "IT"]; // รายการแผนก

const Step3: React.FC<{
  selectedUsers: { id: number; name: string; department: string }[];
  setSelectedUsers: React.Dispatch<
    React.SetStateAction<{ id: number; name: string; department: string }[]>
  >;
  handlePrevStep: () => void;
  handleNextStep: () => void;
}> = ({ selectedUsers, setSelectedUsers, handlePrevStep, handleNextStep }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterUsers(e.target.value, selectedDepartment);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    filterUsers(searchTerm, e.target.value);
  };

  const filterUsers = (search: string, department: string) => {
    const filtered = users.filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesDepartment =
        department === "All" || user.department === department;
      return matchesSearch && matchesDepartment;
    });
    setFilteredUsers(filtered);
  };

  const toggleUserSelection = (user: {
    id: number;
    name: string;
    department: string;
  }) => {
    if (selectedUsers.find((selected) => selected.id === user.id)) {
      setSelectedUsers(
        selectedUsers.filter((selected) => selected.id !== user.id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const canProceed = selectedUsers.length > 0; // เช็คว่ามีการเลือกบุคคลหรือไม่

  const proceedToNextStep = () => {
    if (canProceed) {
      console.log("Selected Users:", selectedUsers);
      handleNextStep(); // เรียกฟังก์ชันที่ส่งมา
    }
  };

  return (
    <div className="mt-7 py-7">
      <div className="flex flex-col gap-4 border px-[50px] py-5.5 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]">
        <div className=" border-b border-stroke  dark:border-strokedark  justify-between flex flex-col sm:flex-row">
          <h2 className=" flex mb-4 items-center justify-center text-xl text-black dark:text-white">Select Users</h2>
          <div className="justify-between flex flex-col sm:flex-row mb-5 gap-3">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full p-2 border rounded-md max-w-[400px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />

            <select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className=" p-2 border rounded-md w-[120px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={
                  selectedUsers.find((selected) => selected.id === user.id) !==
                  undefined
                }
                onChange={() => toggleUserSelection(user)}
                className="mr-2"
              />
              <span>
                {user.name} - {user.department}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevStep}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Previous
          </button>
          <button
            onClick={canProceed ? proceedToNextStep : undefined}
            disabled={!canProceed}
            className={`px-4 py-2 rounded-md ${
              canProceed
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
      {/* ข้อความเตือนหากยังไม่เลือกผู้ใช้ */}
      {!canProceed && (
        <p className="text-red-600">
          Please select at least one user to proceed.
        </p>
      )}
    </div>
  );
};

export default Step3;
