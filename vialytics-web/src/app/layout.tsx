import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vialytics",
  description: "Visual analytics for your wallet history",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
