"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { FaPhoneVolume } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { Input } from "antd";
const { Search } = Input;

// Khai báo global cho Facebook SDK
declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

const AppFooter: React.FC = () => {
  useEffect(() => {
    // Kiểm tra nếu script đã được thêm thì không thêm lại
    if (document.getElementById("facebook-jssdk")) return;

    const fbScript = document.createElement("script");
    fbScript.id = "facebook-jssdk";
    fbScript.async = true;
    fbScript.defer = true;
    fbScript.crossOrigin = "anonymous";
    fbScript.src =
      "https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v21.0";
    document.body.appendChild(fbScript);

    fbScript.onload = () => {
      if (window.FB && window.FB.XFBML) {
        // Đảm bảo parse Facebook Plugin ngay khi script được load xong
        window.FB.XFBML.parse();
      }
    };

    return () => {
      if (fbScript) document.body.removeChild(fbScript);
    };
  }, []);

  return (
    <footer className="bg-gray-800 text-white px-6 md:px-32 w-full">
      <div className="py-10 flex flex-col md:flex-row gap-10 items-start justify-between">
        {/* Kết nối */}
        <div className="flex flex-col gap-3 w-full md:w-1/4">
          <h2 className="text-xl font-bold">Kết nối với CONTROL A DISPLAY</h2>
          <button className="flex items-center gap-2 border border-white rounded-md bg-gray-700 p-3 font-bold">
            <FaPhoneVolume />
            Tổng đài: 1900.9260
          </button>

          <div className="flex items-center gap-2 text-gray-100">
            <MdEmail />
            <span>Email: controla@gmail.com</span>
          </div>

          <div className="flex gap-3 mt-2">
            <FaFacebook className="text-4xl cursor-pointer hover:opacity-80" />
            <IoLogoYoutube className="text-4xl cursor-pointer hover:opacity-80" />
          </div>
        </div>

        {/* Thông tin */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-xl">Thông tin</h2>
          <ul className="text-gray-300 flex flex-col gap-1">
            <li className="hover:text-white cursor-pointer">Về chúng tôi</li>
            <li className="hover:text-white cursor-pointer">
              Thông tin sự kiện
            </li>
            <li className="hover:text-white cursor-pointer">
              Chính sách bảo mật
            </li>
            <li className="hover:text-white cursor-pointer">
              Điều khoản & Điều kiện
            </li>
          </ul>
        </div>

        {/* Facebook */}
        <div className="w-full md:w-1/4">
          <div
            className="fb-page"
            data-href="https://www.facebook.com/standeehochiminh"
            data-tabs=""
            data-width="340"
            data-height="500"
            data-small-header="false"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="true"
          >
            <blockquote
              cite="https://www.facebook.com/standeehochiminh"
              className="fb-xfbml-parse-ignore"
            >
              <a href="https://www.facebook.com/standeehochiminh">
                Standee Hồ Chí Minh
              </a>
            </blockquote>
          </div>
        </div>

        {/* Đăng ký nhận tin */}
        <div className="w-full md:w-1/4 flex flex-col gap-3">
          <h2 className="font-bold text-xl">ĐĂNG KÝ NHẬN TIN</h2>
          <p>
            Đăng ký ngay để nhận được thông báo khi có bài viết mới nhất được
            gửi về hộp thư!
          </p>
          <Search
            placeholder="Nhập email tại đây"
            allowClear
            enterButton="Đăng ký"
            size="large"
          />
          <p className="text-sm text-gray-300">
            Đừng lo lắng, chúng tôi không spam
          </p>
        </div>
      </div>
      <hr />
      <div className="py-10 flex flex-col md:flex-row justify-between">
        <p className="text-sm text-center md:text-left">
          © Copyright 2018-2024 Bản quyền website thuộc sở hữu của CÔNG TY TNHH
          CÔNG NGHỆ HỒNG BẢO.
        </p>
        <div className="flex justify-center md:justify-start mt-5 md:mt-0">
          <img src="../payment.png" alt="payment" className="w-[200px]" />
        </div>
      </div>
    </footer>
  );
};

// Sử dụng dynamic import để tránh lỗi SSR
const AppFooterWithNoSSR = dynamic(() => Promise.resolve(AppFooter), {
  ssr: false,
});

export default AppFooterWithNoSSR;
