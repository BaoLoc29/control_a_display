import classNames from "classnames";
import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { LuArrowLeftToLine } from "react-icons/lu";
import { DASHBOARD_SIDEBAR_LINKS } from "../../lib/consts/navigation";
import { Link, useLocation } from "react-router-dom";

const linkClass =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-blue-200 hover:no-underline active:bg-blue-200 rounded-sm text-base";

function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`flex flex-col bg-white ${
        open ? "w-60" : "w-20"
      } duration-300 p-3 text-neutral-900 relative`}
    >
      {open ? (
        <div className=" flex items-center gap-2 pb-3 border-b border-neutral-900">
          <img
            src={assets.logo_controla}
            alt="logo"
            width={40}
            onMouseEnter={() => setOpen(true)} // Mở khi hover vào logo
          />
          <p className="font-bold text-orange-400 text-xl">CONTROL A</p>
          <LuArrowLeftToLine
            className="bg-white text-blue-700 ml-auto text-2xl cursor-pointer"
            onClick={() => {
              setOpen(!open);
            }}
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
          ? "bg-blue-100 text-blue-700"
          : "text-black hover:text-blue-700",
        linkClass
      )}
    >
      <span className="text-2xl">{item.icon}</span>
      {open ? <span>{item.label}</span> : null}
    </Link>
  );
}

export default Sidebar;
