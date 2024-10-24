import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";

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
  // const [filteredUsers, setFilteredUsers] = useState(users);

  // กำหนด columns สำหรับ DataGrid
  const columns: GridColDef[] = [
    { field: "employeeid", headerName: "รหัสพนักงาน", width: 100 },
    { field: "name", headerName: "ชื่อ", width: 200 },
    { field: "level", headerName: "ระดับ", width: 150 },
    { field: "position", headerName: "ตำแหน่ง", width: 300 },
  ];

  // const filterUsers = (search: string, department: string) => {
  //   const filtered = users.filter((user) => {
  //     const matchesSearch = user.name
  //       .toLowerCase()
  //       .includes(search.toLowerCase());
  //     const matchesDepartment =
  //       department === "All" || user.department === department;
  //     return matchesSearch && matchesDepartment;
  //   });
  //   setFilteredUsers(filtered);
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    //filterUsers(e.target.value, selectedDepartment);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<any>) => {
    setSelectedDepartment(e.target.value as string);
    //filterUsers(searchTerm, e.target.value as string);
  };

  const toggleUserSelection = (selectionModel: GridRowSelectionModel) => {
    const selected = selectionModel.map(
      (id) => users.find((user) => user.id === id)!
    );
    setSelectedUsers(selected);
  };

  const canProceed = selectedUsers.length > 0;

  const [users, setUser] = useState([]);
  const { data: session } = useSession();


  useEffect(() => {
    if (session?.user?.email) {
      fetchUser(session.user.email);
    }
  }, [session?.user?.email]);

  const fetchUser = async (email:string) => {
    try {
      const resuser = await axios.get(`/api/v2/user/select/${email}`);
      const res = await axios.get(`/api/v3/organization/select?name=${resuser.data.section}`);
      //const res = await axios.get("/api/v2/user");
      setUser(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-7 py-7">
      <div className="flex flex-col gap-4 border px-[50px] py-5.5 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-[20px]">
        <div className="border-b border-stroke dark:border-strokedark justify-between flex flex-col sm:flex-row">
          <h2 className="flex mb-4 items-center justify-center text-xl text-black dark:text-white">
            พนักงานที่สามารถเข้าร่วมได้
          </h2>
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
              {/* {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))} */}
            </select>
          </div>
        </div>

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={users}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={toggleUserSelection}
            rowSelectionModel={selectedUsers.map((user) => user.id)}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            sx={{
              boxShadow: 0,
              border: 0,
            }}
          />
        </div>
      </div>
      <div className="flex justify-between mt-9">
        <Button
          onClick={handlePrevStep}
          variant="contained"
          className="inline-flex items-center justify-center rounded-full bg-meta-6 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Previous
        </Button>
        <Button
          onClick={canProceed ? handleNextStep : undefined}
          disabled={!canProceed}
          variant="contained"
          className="inline-flex items-center justify-center rounded-full bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Step3;
