import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MediFirst",
  description: "MediFirst - Medical Store Billing System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientLayout>
          <header className="flex w-full justify-between items-center px-6 py-4 bg-blue-600 text-white shadow-md">
            <Link href="/" className="text-2xl font-extrabold tracking-tight cursor-pointer">MediFirst</Link>
            <nav>
              <ul className="flex space-x-6 text-lg font-medium">
                <li><Link href="/" className="hover:underline underline-offset-4">Home</Link></li>
                <li><Link href="/products" className="hover:underline underline-offset-4">Products</Link></li>
                <li><Link href="/bills/create" className="hover:underline underline-offset-4">Create Bill</Link></li>
                <li><Link href="/bills" className="hover:underline underline-offset-4">View Bills</Link></li>
                <li><Link href="/analytics" className="hover:underline underline-offset-4">Analytics</Link></li>
              </ul>
            </nav>
          </header>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
