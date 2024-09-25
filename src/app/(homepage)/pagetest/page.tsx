"use client";

import { Url } from 'next/dist/shared/lib/router/router';
import { useRouter } from "next/navigation";
import { useState } from 'react';

function Pagetest() {
    const router = useRouter();

  // สร้าง list ที่มีชื่อ page และ route
  const [pages] = useState([
    { page: 'InputForm', route: '/Demo/InputForm' },
    { page: 'Stepper', route: '/Demo/Stepper' },
    { page: 'Table', route: '/Demo/Table' },
    { page: 'Tablev2', route: '/Demo/Tablev2' },
    { page: 'Tablev3', route: '/Demo/Tablev3' },
    { page: 'Tablev31', route: '/Demo/Tablev31' },
    { page: 'inputtest2', route: '/Demo/inputtest2' },
    { page: 'inputtest3', route: '/Demo/inputtest3' },
    { page: 'inputtest4', route: '/Demo/inputtest4' },
    { page: 'testlist', route: '/Demo/testlist' },
    { page: 'trainingsurvey', route: '/trainingsurvey' },
  ]);

  // ฟังก์ชันสำหรับไปยังเส้นทางใหม่
  const handleNavigate = (route:string) => {
    router.push(route); // ใช้ useRouter เพื่อนำทาง
  };

  return (
    <div>
      <h1>Page List</h1>
      {pages.map((item, index) => (
        <button
          key={index}
          onClick={() => handleNavigate(item.route)} // คลิกแล้วไปที่ route นั้น
          className="m-2 p-2 bg-blue-500 text-white rounded"
        >
          {item.page}
        </button>
      ))}
    </div>
  );
}

export default Pagetest;