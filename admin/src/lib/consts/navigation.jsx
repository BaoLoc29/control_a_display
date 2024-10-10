import { HiOutlineViewGrid } from "react-icons/hi";
import { FaUserTie } from "react-icons/fa";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "employees",
    label: "Users",
    path: "/users",
    icon: <FaUserTie />,
  },
];
