'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

export default function BillDetailsPage({ params }) {
  const { id } = React.use(params);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchBill() {
      try {
        const res = await fetch(`/api/bills/${id}`);
        if (!res.ok) throw new Error('Failed to fetch bill');
        const data = await res.json();
        setBill(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBill();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8 text-blue-600">Loading bill...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!bill) return <div className="p-8 text-gray-600">Bill not found.</div>;

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-blue-100 via-white to-blue-200 py-8 print:bg-white">
      <div className="w-full max-w-2xl p-6 bg-blue-50/60 rounded-2xl shadow-2xl print:shadow-none print:rounded-none">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-2xl font-extrabold text-blue-800">Invoice</h1>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="px-4 py-2 bg-green-700 text-white rounded font-semibold shadow hover:bg-green-800 transition-all">Print Invoice</button>
            <Link href="/bills" className="px-4 py-2 bg-blue-700 text-white rounded font-semibold shadow hover:bg-blue-800 transition-all">Back to Bills</Link>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-900 mb-2">MediFirst</h2>
          <div className="text-gray-600">Date: {new Date(bill.date).toLocaleDateString()}</div>
          <div className="text-gray-600">Customer: <span className="font-semibold text-gray-900">{bill.customerName}</span></div>
          <div className="text-gray-600">Payment Method: {bill.paymentMethod}</div>
        </div>
        <table className="w-full mb-6 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-700">
              <th className="py-2 px-2 text-left font-bold text-white">Product</th>
              <th className="py-2 px-2 text-left font-bold text-white">Qty</th>
              <th className="py-2 px-2 text-left font-bold text-white">Unit Price</th>
              <th className="py-2 px-2 text-left font-bold text-white">Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                <td className="py-2 px-2 text-blue-900 font-medium">{item.product?.name || 'Product'}</td>
                <td className="py-2 px-2 text-gray-700">{item.quantity}</td>
                <td className="py-2 px-2 text-gray-700">{(item.price / item.quantity).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                <td className="py-2 px-2 font-semibold text-gray-900">{item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right text-xl font-bold text-green-800 mb-2 bg-green-50 py-2 px-4 rounded-lg inline-block ml-auto w-fit">Total: {bill.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
        <div className="text-center text-gray-400 text-sm mt-8 print:hidden">Thank you for your purchase!</div>
      </div>
      <style jsx global>{`
        .shadow-2xl { box-shadow: 0 8px 32px 0 rgba(30, 64, 175, 0.10); }
        @media print {
          body {
            background: #fff !important;
          }
          .min-h-screen, .bg-gradient-to-br, .bg-blue-100, .bg-blue-200, .bg-blue-50, .bg-blue-50\/60 {
            background: #fff !important;
          }
          header, nav, footer, .print\:hidden {
            display: none !important;
          }
          .shadow-2xl, .print\:shadow-none {
            box-shadow: none !important;
          }
          .rounded-2xl, .print\:rounded-none {
            border-radius: 0 !important;
          }
          .max-w-2xl {
            max-width: 700px !important;
          }
          .p-6, .py-8, .px-4, .px-8, .py-2, .mb-6, .mt-8, .mb-2, .mb-8 {
            padding: 0 !important;
            margin: 0 !important;
          }
          .bg-green-50, .bg-blue-50, .bg-blue-700, .bg-blue-50\/60 {
            background: #fff !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          th, td {
            border: 1px solid #222 !important;
            color: #111 !important;
            background: #fff !important;
            padding: 8px !important;
          }
          th {
            background: #f3f4f6 !important;
            color: #111 !important;
          }
          .text-blue-800, .text-blue-900, .text-green-800, .text-green-700, .text-gray-900, .text-gray-700, .text-gray-600, .text-gray-400, .text-gray-500 {
            color: #111 !important;
          }
          .bg-white {
            background: #fff !important;
          }
          .rounded-lg {
            border-radius: 0 !important;
          }
          .inline-block, .ml-auto, .w-fit {
            display: block !important;
            margin-left: 0 !important;
            width: 100% !important;
          }
          .mb-2 {
            margin-bottom: 0.5rem !important;
          }
          .mb-6 {
            margin-bottom: 1rem !important;
          }
          .text-xl, .font-bold, .font-extrabold {
            font-weight: 700 !important;
          }
          .border {
            border: 1px solid #222 !important;
          }
        }
      `}</style>
    </div>
  );
} 