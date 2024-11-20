import { HiOutlineViewGrid } from "react-icons/hi";
import { BiSolidBookContent } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
import { RiShieldUserFill } from "react-icons/ri";
import { FaUsersGear } from "react-icons/fa6";
import { BsBookHalf, BsMenuButtonWideFill } from "react-icons/bs";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "menu",
    label: "Menus",
    path: "/menus",
    icon: <BsMenuButtonWideFill />,
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
  {
    key: "permission",
    label: "Permissions",
    path: "/permissions",
    icon: <FaUsersGear />,
  },
];
