
import AppHeader from "@/components/app.header";
import "./globals.css";
import AppFooter from "@/components/app.footer";

export const metadata = {
  title: "【CONTROL A】 STANDEE BOOTH SAMPLING NHẬP KHẨU | 0976 503 479",
  description: "control a display",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
