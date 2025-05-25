import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FloatingNavbar from "@/components/FloatingNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FutureSearch - AI-Powered Search",
  description:
    "FutureSearch is an AI-powered search engine connected to the internet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="en">
      <body className={`${inter.className} h-full`}>
        <FloatingNavbar />
        <main className="h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
