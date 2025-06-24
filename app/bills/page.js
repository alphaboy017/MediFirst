'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BillsListPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBills() {
      try {
        const res = await fetch('/api/bills');
        if (!res.ok) throw new Error('Failed to fetch bills');
        const data = await res.json();
        setBills(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-blue-100 via-white to-blue-200 py-8">
      <div className="w-full max-w-4xl p-4 bg-white rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700 drop-shadow">Bills List</h1>
          <Link href="/" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-200 transition-all">Home</Link>
        </div>
        {loading ? (
          <p className="text-blue-600">Loading bills...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : bills.length === 0 ? (
          <p className="text-gray-600">No bills found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-blue-50">
                  <th className="py-3 px-4 text-left font-bold text-gray-700">Customer</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-700">Date</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-700">Total</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-700">Payment</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-700">Items</th>
                  <th className="py-3 px-4 text-left font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id} className="border-b hover:bg-blue-50 transition-all">
                    <td className="py-3 px-4 font-semibold text-blue-900">{bill.customerName}</td>
                    <td className="py-3 px-4 text-blue-700">{new Date(bill.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-bold text-green-700">{bill.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                    <td className="py-3 px-4 text-blue-700">{bill.paymentMethod}</td>
                    <td className="py-3 px-4 text-gray-700">
                      <ul className="list-disc ml-4">
                        {bill.items.map((item, idx) => (
                          <li key={idx} className="text-sm">
                            {item.quantity} x {item.product?.name || 'Product'} ({item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/bills/${bill._id}`} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold shadow transition-all whitespace-nowrap min-w-[170px] text-center block">View Details / Print Invoice</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 