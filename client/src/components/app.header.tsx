"use client";
import { getMenu } from "@/services/menu";
import { SearchOutlined, DownOutlined, MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { IoIosCloseCircle } from "react-icons/io";

const AppHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [submenuOpen, setSubmenuOpen] = useState<{ [key: string]: boolean }>(
    {}
  );

  interface Menu {
    id: string;
    title: string;
    slug: string;
    type: string;
    articleCategoryId: Submenu[];
  }

  interface Submenu {
    id: string;
    name: string;
    slug: string;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubmenu = (menuId: string) => {
    setSubmenuOpen((prevState) => ({
      ...prevState,
      [menuId]: !prevState[menuId],
    }));
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await getMenu();
        const data = res.data;
        setMenus(data.menus);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    fetchMenus();
  }, []);

  return (
    <header>
      <div className="container flex items-center justify-between py-4 px-6 md:px-32 z-50">
        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button
            className="text-gray-500 hover:text-orange-400"
            onClick={toggleMenu}
          >
            <MenuOutlined className="text-3xl text-gray-700" />
          </button>
        </div>

        {/* Logo */}
        <div className="md:mx-0 mx-auto">
          <Link href="/">
            <img src="../logo.png" alt="logo" width={200} />
          </Link>
        </div>

        {/* Navigation Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {menus.map((menu) => (
            <li key={menu.id} className="relative group">
              <Link
                href={`/${menu.slug}`}
                className="flex gap-2 no-underline hover:text-orange-400 font-bold"
              >
                {menu.title}
                {menu.articleCategoryId &&
                  menu.articleCategoryId.length > 0 && <DownOutlined />}
              </Link>
              {menu.articleCategoryId && menu.articleCategoryId.length > 0 && (
                <ul
                  className={`absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md p-1 left-0 z-10 transition-all duration-200 ease-in-out opacity-0 group-hover:opacity-100`}
                >
                  {menu.articleCategoryId.map((submenu) => (
                    <li key={submenu.id}>
                      <Link
                        href={`/${submenu.slug}`}
                        className="block px-3 py-1 hover:text-orange-400 rounded-md"
                      >
                        {submenu.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Search Bar */}
        <div className="relative w-1/3 md:w-1/4 hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-full border-gray-300 px-4 py-2 shadow-sm"
          />
          <SearchOutlined className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Navigation Menu - Mobile version */}
      <div
        className={`fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Link href="/">
            <img src="../logo.png" alt="logo" width={200} />
          </Link>
          <button
            className="text-gray-500 hover:text-orange-400"
            onClick={toggleMenu}
          >
            <IoIosCloseCircle className="text-3xl text-gray-700" />
          </button>
        </div>
        <ul className="flex flex-col gap-2 p-4 text-xl">
          {menus.map((menu) => (
            <li key={menu.id}>
              {/* If menu type is "Link", show direct link, if "Option", show submenu */}
              {menu.type === "Link" ? (
                <Link
                  href={`/${menu.slug}`}
                  className="flex gap-2 no-underline hover:text-orange-400 font-bold"
                >
                  {menu.title}
                </Link>
              ) : (
                <div
                  onClick={() => toggleSubmenu(menu.id)}
                  className="cursor-pointer flex gap-2 no-underline hover:text-orange-400 font-bold"
                >
                  {menu.title}
                  <DownOutlined />
                </div>
              )}

              {menu.type === "Option" && menu.articleCategoryId && (
                <ul
                  className={`${
                    submenuOpen[menu.id] ? "block" : "hidden"
                  } bg-white py-1 pl-3 w-full`}
                >
                  <li>
                    <Link
                      href={`/${menu.slug}`}
                      className="block py-1 text-sm text-gray-500 hover:text-orange-400"
                    >
                      Go to in {menu.title}
                    </Link>
                  </li>
                  {menu.articleCategoryId.map((submenu) => (
                    <li key={submenu.id}>
                      <Link
                        href={`/${submenu.slug}`}
                        className="flex hover:text-orange-400 py-1"
                      >
                        {submenu.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Search Bar */}
        <div className="relative px-5">
          <input
            type="text"
            placeholder="Search..."
            className="text-xl focus:outline-none active:outline-none border border-gray-300 w-full h-12 pl-11 pr-4 rounded-sm"
          />
          <HiOutlineSearch
            fontSize={20}
            className="text-gray-400 absolute top-1/2 left-8 -translate-y-1/2"
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
