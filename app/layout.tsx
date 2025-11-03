import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Party Task Tracker",
  description: "Aesthetic, group-wise task tracking for Party A and Party B",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
