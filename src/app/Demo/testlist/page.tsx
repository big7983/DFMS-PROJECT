"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import people from "./people.json";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const router = useRouter();

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!departmentFilter || person.department === departmentFilter)
  );

  const handleTogglePerson = (personName: string) => {
    if (selectedPeople.includes(personName)) {
      setSelectedPeople(selectedPeople.filter((name) => name !== personName));
    } else {
      setSelectedPeople([...selectedPeople, personName]);
    }
  };

  const handleSubmit = () => {
    if (selectedPeople.length > 0) {
      localStorage.setItem("user", JSON.stringify({ selectedPeople }));
      router.push(
        `/people?names=${encodeURIComponent(selectedPeople.join(","))}`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Search for People</h1>

      <input
        type="text"
        placeholder="Search by name"
        className="border p-2 w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
        className="border p-2 w-full mb-6"
      >
        <option value="">All Departments</option>
        <option value="Engineering">Engineering</option>
        <option value="Marketing">Marketing</option>
        <option value="Human Resources">Human Resources</option>
        <option value="Finance">Finance</option>
      </select>

      <ul className="space-y-4">
        {filteredPeople.map((person) => (
          <li
            key={person.id}
            className={`cursor-pointer p-4 rounded ${
              selectedPeople.includes(person.name)
                ? "bg-blue-200"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => handleTogglePerson(person.name)}
          >
            <p className="text-lg font-medium">{person.name}</p>
            <p className="text-sm text-gray-500">{person.department}</p>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubmit}
        disabled={selectedPeople.length === 0}
        className={`mt-6 py-2 px-4 rounded ${
          selectedPeople.length === 0 ? "bg-gray-300" : "bg-blue-500 text-white"
        }`}
      >
        Submit Selected ({selectedPeople.length})
      </button>
    </div>
  );
}
