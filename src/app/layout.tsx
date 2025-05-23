import "bootstrap/dist/css/bootstrap.min.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Genos, Poppins, Roboto } from "next/font/google";

import NavbarElement from "@/components/Navbar";
import { Provider } from "@/components/provider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeutschInContext",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${geistSans.variable} ${geistMono.variable} `}>
          <NavbarElement />
          {children}
          {/* Global Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
        </body>
      </Provider>
    </html>
  );
}
