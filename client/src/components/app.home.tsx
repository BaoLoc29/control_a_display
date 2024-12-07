"use client";
import Link from "next/link";
import { HiCalendarDateRange } from "react-icons/hi2";
import { FaEye } from "react-icons/fa";

const AppHome: React.FC = () => {
  return (
    <div className="my-5">
      {/* Banner Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="border lg:w-2/3">
          <Link href="/">
            <img
              src="https://zozo.vn/upload/public/khuyen-mai/xuan-gan-ket-2024-zozo.png"
              alt="image"
              className="w-full h-auto object-cover"
            />
          </Link>
          <div className="p-3">
            <Link href="/">
              <h2 className="text-lg md:text-xl font-bold mb-2 hover:text-orange-400">
                Chào Xuân Ất Tỵ tặng Coca-Cola và Bia Heineken: Đến ngay Zozo
                nhận quà cực Tết!
              </h2>
            </Link>
            <p className="flex items-center gap-2 text-lg md:text-base text-gray-500">
              <HiCalendarDateRange />
              06/12/2024 | 16:12 | author | <FaEye />
            </p>
          </div>
        </div>

        <div className="flex-1 lg:w-1/3">
          <ul>
            {[...Array(3)].map((_, index) => (
              <li key={index} className="border-y py-2">
                <Link href="/">
                  <h2 className="mb-1 text-lg md:text-xl hover:text-orange-400">
                    Chào Xuân Ất Tỵ tặng Coca-Cola và Bia Heineken: Đến ngay
                    Zozo nhận quà cực Tết!
                  </h2>
                </Link>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-gray-500">
                  <p className="text-lg md:text-base flex gap-2 items-center">
                  <HiCalendarDateRange /> 06/12/2024 | 16:12 | author | <FaEye />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-full mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-md overflow-hidden"
          >
            <Link href="/">
              <img
                src="https://zozo.vn/upload/public/khuyen-mai/xuan-gan-ket-2024-zozo.png"
                alt="img"
                className="w-full object-cover"
              />
            </Link>
            <div className="flex flex-col p-4 gap-2">
              <p className="text-lg md:text-base text-gray-600 hover:text-orange-400">
                <Link href="/">Khuyến mãi</Link>
              </p>
              <Link href="/">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 hover:text-orange-400">
                  Chào Xuân Ất Tỵ tặng Coca-Cola và Bia Heineken: Đến ngay Zozo
                  nhận quà cực Tết!
                </h3>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppHome;
