import { HiOutlineViewGrid } from "react-icons/hi";
import { BiSolidBookContent } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
import { RiShieldUserFill } from "react-icons/ri";
import { BsBookHalf } from "react-icons/bs";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "article-category",
    label: "Article Category",
    path: "/article-category",
    icon: <BiSolidBookContent />,
  },
  {
    key: "article",
    label: "Article",
    path: "/article",
    icon: <BsBookHalf />,
  },
  {
    key: "employees",
    label: "Users",
    path: "/users",
    icon: <FaUserTie />,
  },
  {
    key: "role",
    label: "Role",
    path: "/roles",
    icon: <RiShieldUserFill />,
  },
];
