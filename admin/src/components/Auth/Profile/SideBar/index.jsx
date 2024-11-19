import React from "react";
import { FaLock } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { MdAttachEmail } from "react-icons/md";

const Sidebar = ({ activeButton, handleButtonClick }) => {
  return (
    <div className="w-full md:w-1/4 lg:w-1/5 rounded-sm flex flex-col">
      <div className="space-y-4">
        <button
          className={`flex items-center gap-2 pl-3 w-full h-[2.5rem] text-white text-base md:text-lg ${
            activeButton === "info" ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"
          }`}
          onClick={() => handleButtonClick("info")}
        >
          <IoSettings />
          Update user
        </button>
        <button
          className={`flex items-center gap-2 pl-3 w-full h-[2.5rem] text-white text-base md:text-lg ${
            activeButton === "password" ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"
          }`}
          onClick={() => handleButtonClick("password")}
        >
          <FaLock />
          Change password
        </button>
        <button
          className={`flex items-center gap-2 pl-3 w-full h-[2.5rem] text-white text-base md:text-lg ${
            activeButton === "email" ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"
          }`}
          onClick={() => handleButtonClick("email")}
        >
          <MdAttachEmail />
          Change email
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
