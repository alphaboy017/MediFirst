'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalyticsDashboard() {
  const [bills, setBills] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const billsRes = await fetch('/api/bills');
        const productsRes = await fetch('/api/products');
        const billsData = await billsRes.json();
        const productsData = await productsRes.json();
        setBills(Array.isArray(billsData) ? billsData : billsData || []);
        setProducts(Array.isArray(productsData.products) ? productsData.products : []);
      } catch (err) {
        setError('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate stats
  const totalSales = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
  const numBills = bills.length;
  const productSales = {};
  bills.forEach(bill => {
    bill.items.forEach(item => {
      const name = item.product?.name || 'Unknown';
      productSales[name] = (productSales[name] || 0) + item.quantity;
    });
  });
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const lowStock = products.filter(p => p.quantity < 10);
  const now = new Date();
  const expiringSoon = products.filter(p => {
    const expiry = new Date(p.expiryDate);
    return expiry - now < 30 * 24 * 60 * 60 * 1000 && expiry > now;
  });
  // Sales over time (by date)
  const salesByDate = {};
  bills.forEach(bill => {
    const date = new Date(bill.date).toLocaleDateString();
    salesByDate[date] = (salesByDate[date] || 0) + bill.totalAmount;
  });
  const salesChartData = Object.entries(salesByDate).map(([date, total]) => ({ date, total }));

  if (loading) return <div className="p-8 text-blue-600">Loading analytics...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-8">
      <div className="w-full max-w-5xl mx-auto bg-white/90 rounded-3xl shadow-2xl px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800">Analytics Dashboard</h1>
          <Link href="/" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-200 transition-all">Home</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-blue-50 rounded-xl p-6 shadow text-center">
            <div className="text-lg font-semibold text-gray-600 mb-2">Total Sales</div>
            <div className="text-2xl font-bold text-green-700">{totalSales.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow text-center">
            <div className="text-lg font-semibold text-gray-600 mb-2">Number of Bills</div>
            <div className="text-2xl font-bold text-blue-700">{numBills}</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow text-center">
            <div className="text-lg font-semibold text-gray-600 mb-2">Inventory Value</div>
            <div className="text-2xl font-bold text-blue-700">{products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-lg font-semibold text-gray-600 mb-2">Top Selling Products</div>
            <ul>
              {topProducts.map(([name, qty], idx) => (
                <li key={name} className="flex justify-between py-1 text-blue-900 font-medium">
                  <span>{idx + 1}. {name}</span>
                  <span>{qty} sold</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-lg font-semibold text-gray-600 mb-2">Low Stock Products</div>
            <ul>
              {lowStock.length === 0 ? <li className="text-green-600">All stocks healthy!</li> : lowStock.map(p => (
                <li key={p._id} className="flex justify-between py-1 text-red-700 font-medium">
                  <span>{p.name}</span>
                  <span>{p.quantity} left</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-lg font-semibold text-gray-600 mb-2">Expiring Soon</div>
            <ul>
              {expiringSoon.length === 0 ? <li className="text-green-600">No products expiring soon!</li> : expiringSoon.map(p => (
                <li key={p._id} className="flex justify-between py-1 text-yellow-700 font-medium">
                  <span>{p.name}</span>
                  <span>{new Date(p.expiryDate).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-lg font-semibold text-gray-600 mb-2">Sales Over Time</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salesChartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="total" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 