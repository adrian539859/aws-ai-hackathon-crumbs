import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { LoginProvider } from "@/components/LoginProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crumbs - Your Travel Companion",
  description: "Plan your trips and explore the world with Crumbs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <LoginProvider>{children}</LoginProvider>
      </body>
    </html>
  );
}
