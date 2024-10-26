import classNames from "classnames";
import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { LuArrowLeftToLine } from "react-icons/lu";
import { DASHBOARD_SIDEBAR_LINKS } from "../../lib/consts/navigation";
import { Link, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi"; // Import icon menu
import { useMediaQuery } from "react-responsive"; // Thư viện để kiểm tra kích thước màn hình

const linkClass =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-blue-200 hover:no-underline active:bg-blue-200 rounded-sm text-lg";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Thêm state cho di động

  // Xác định thiết bị di động
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  const handleMouseEnter = () => {
    if (!isPinned && !isMobile) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned && !isMobile) {
      setOpen(false);
    }
  };

  const handleTogglePin = () => {
    setIsPinned(!isPinned);
    setOpen(true);
  };

  // Xử lý hiển thị sidebar khi ở chế độ mobile
  const toggleSidebarVisibility = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
      {/* Hiển thị nút menu ở chế độ di động */}
      {isMobile && (
        <button
          className="text-2xl p-2 bg-blue-500 text-white fixed top-2 left-2 z-50"
          onClick={toggleSidebarVisibility}
        >
          <FiMenu />
        </button>
      )}

      <div
        className={classNames(
          "sm:flex flex-col bg-white h-screen z-50",
          open ? "w-60" : "w-20",
          "duration-300 p-3 text-neutral-900 relative",
          isMobile && isSidebarVisible ? "flex" : "hidden"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {open ? (
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-900">
            <img src={assets.logo_controla} alt="logo" width={40} />
            <p className="font-bold text-orange-400 text-xl">CONTROL A</p>
            <LuArrowLeftToLine
              className="bg-white text-blue-700 ml-auto text-2xl cursor-pointer"
              onClick={handleTogglePin}
            />
          </div>
        ) : (
          <div className="flex justify-center pb-3 border-b border-neutral-900">
            <img
              src={assets.logo_controla}
              alt="logo"
              width={40}
              onMouseEnter={() => setOpen(true)}
            />
          </div>
        )}
        <div className="pt-3 pb-5 flex flex-1 flex-col gap-0.5">
          {DASHBOARD_SIDEBAR_LINKS.map((item) => (
            <SidebarLink key={item.key} item={item} open={open} />
          ))}
        </div>
      </div>

      {/* Xử lý bấm ra ngoài khi ở chế độ mobile */}
      {isMobile && isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebarVisibility}
        ></div>
      )}
    </div>
  );
}

function SidebarLink({ item, open }) {
  const { pathname } = useLocation();
  return (
    <Link
      to={item.path}
      className={classNames(
        { "flex items-center justify-center": !open },
        pathname === item.path
          ? "bg-blue-200 text-blue-700 hover:text-blue-700"
          : "hover:text-blue-700 text-gray-700", // Thêm class text-gray-700 cho các item không được chọn
        linkClass
      )}
    >
      <span className="text-2xl">{item.icon}</span>
      {open ? <span>{item.label}</span> : null}
    </Link>
  );
}

export default Sidebar;
