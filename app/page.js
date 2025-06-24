'use client';
import Link from "next/link";
import { FaBoxOpen, FaFileInvoiceDollar, FaPlusCircle } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      <div className="w-full max-w-5xl mx-auto bg-white/80 rounded-3xl shadow-2xl px-8 py-12 mt-8 mb-8 animate-fade-in">
        <div className="relative flex flex-col items-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-2 text-center bg-gradient-to-r from-blue-700 via-cyan-600 to-green-600 bg-clip-text text-transparent drop-shadow-md relative z-10">
            Welcome to MediFirst
          </h1>
          {/* Subtle shadow/glow behind heading */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-10 z-0 pointer-events-none" aria-hidden>
            <div className="w-full h-full rounded-full blur-md opacity-15 bg-gradient-to-r from-blue-200 via-cyan-100 to-green-100"></div>
          </div>
          {/* Simple, elegant underline */}
          <div className="flex justify-center my-2 z-10">
            <span className="block w-24 h-0.5 rounded-full bg-gray-200"></span>
          </div>
        </div>
        <p className="text-2xl sm:text-3xl mb-12 text-gray-500 font-medium max-w-2xl mx-auto text-center">
          Manage your pharmacy inventory and billing efficiently
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-10 w-full max-w-5xl mx-auto">
          {/* Products Card */}
          <div className="flex flex-col items-center p-8 border rounded-2xl shadow-lg w-full md:w-80 bg-white hover:shadow-2xl transition-transform duration-200 hover:scale-105 cursor-pointer">
            <FaBoxOpen className="text-4xl text-blue-500 mb-3" />
            <h2 className="text-2xl font-bold mb-2 text-blue-700">Products</h2>
            <p className="text-blue-600 mb-4 text-center">Manage your product inventory</p>
            <Link href="/products" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150">
              View Products
            </Link>
          </div>

          {/* Create Bill Card */}
          <div className="flex flex-col items-center p-8 border rounded-2xl shadow-lg w-full md:w-80 bg-white hover:shadow-2xl transition-transform duration-200 hover:scale-105 cursor-pointer">
            <FaFileInvoiceDollar className="text-4xl text-green-500 mb-3" />
            <h2 className="text-2xl font-bold mb-2 text-green-700">Create Bill</h2>
            <p className="text-green-600 mb-4 text-center">Generate new bills for customers</p>
            <Link href="/bills/create" className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-150">
              New Bill
            </Link>
          </div>

          {/* Add Product Card */}
          <div className="flex flex-col items-center p-8 border rounded-2xl shadow-lg w-full md:w-80 bg-white hover:shadow-2xl transition-transform duration-200 hover:scale-105 cursor-pointer">
            <FaPlusCircle className="text-4xl text-teal-500 mb-3" />
            <h2 className="text-2xl font-bold mb-2 text-teal-700">Add Product</h2>
            <p className="text-teal-600 mb-4 text-center">Add new products to inventory</p>
            <Link href="/products/add" className="px-6 py-2 bg-teal-500 text-white rounded-lg font-semibold shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-150">
              Add Product
            </Link>
          </div>
        </div>
      </div>
      <footer className="flex items-center justify-center w-full h-16 border-t bg-white/70 mt-10 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MediFirst. All rights reserved.
      </footer>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-slow { animation: fade-in 1.2s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-slower { animation: fade-in 1.8s cubic-bezier(.4,0,.2,1) both; }
        .drop-shadow-md { filter: drop-shadow(0 4px 16px rgba(0,120,180,0.08)); }
      `}</style>
    </div>
  );
}
