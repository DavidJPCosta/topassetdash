import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Asset Dashboard",
  description: "European Asset Dashboard",
  icons: [
    {
      rel: "icon",
      url:
        "data:image/svg+xml," +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
          <path d="M20 2L34 10V20C34 28.5 27.5 36 20 38C12.5 36 6 28.5 6 20V10L20 2Z" fill="#1E293B" stroke="#475569" strokeWidth="1.2"/>
          <path d="M12 24L18 17L22 20L28 12" stroke="#EAB308" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M28 12H24M28 12V16" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="20" y="23" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif" fontWeight="600">&euro;</text>
        </svg>`,
        ),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-slate-900 text-slate-300 transition-colors duration-300`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
