import Navbar from "@/components/navbar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Dashboard",
  description:
    "A sleek portfolio dashboard to analyze investments and fund overlap.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`$antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
