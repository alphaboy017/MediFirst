'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import RequireAuth from '../components/RequireAuth';

function getBadgeClass(quantity, expiryDate) {
  const daysToExpiry = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
  if (quantity < 5) return 'bg-red-100 text-red-700';
  if (daysToExpiry < 30) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-700';
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [thresholds, setThresholds] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products || []);
      // Set default threshold for each product if not already set
      setThresholds((prev) => {
        const updated = { ...prev };
        (data.products || []).forEach((p) => {
          if (updated[p._id] === undefined) updated[p._id] = 30;
        });
        return updated;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        fetchProducts();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleThresholdChange = (productId, value) => {
    setThresholds((prev) => ({ ...prev, [productId]: value }));
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto p-4">Loading products...</div>;
  }
  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    // <RequireAuth>
      <div className="min-h-screen w-full flex justify-center items-start bg-gradient-to-br from-blue-100 via-white to-blue-200 py-8">
        <div className="container mx-auto p-4 relative bg-white rounded-2xl shadow-2xl">
          <Link href="/" className="absolute top-4 right-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-200 transition-all">Home</Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-4xl font-extrabold text-blue-600 drop-shadow-sm">Products</h1>
            <Link href="/products/add" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all">Add New Product</Link>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 border border-blue-200 bg-blue-50 text-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300 shadow-sm"
            />
          </div>
          {filteredProducts.length === 0 ? (
            <p className="mt-4 text-gray-600 font-medium">No products found.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-3 px-4 text-left font-bold text-gray-700">Name</th>
                    <th className="py-3 px-4 text-left font-bold text-gray-700">Category</th>
                    <th className="py-3 px-4 text-left font-bold text-gray-700">Description</th>
                    <th className="py-3 px-4 text-left font-bold text-gray-700">Price</th>
                    <th className="py-3 px-4 text-left font-bold text-gray-700">Quantity</th>
                    <th className="py-3 px-4 text-left font-bold text-gray-700">Expiry</th>
                    <th className="py-3 px-4 text-left font-bold text-gray-700">Alert Threshold (days)</th>
                    <th className="py-3 px-4 text-center font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const badgeClass = getBadgeClass(product.quantity, product.expiryDate);
                    const daysToExpiry = Math.floor((new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    const threshold = thresholds[product._id] || 30;
                    const isExpiring = daysToExpiry < threshold && daysToExpiry >= 0;
                    return (
                      <tr key={product._id} className={`border-b hover:bg-blue-50 transition-all${isExpiring ? ' bg-yellow-50' : ''}`}>
                        <td className="py-3 px-4 font-semibold text-blue-900">{product.name}</td>
                        <td className="py-3 px-4 text-blue-700">{product.category}</td>
                        <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{product.description}</td>
                        <td className="py-3 px-4 font-bold text-green-700">{product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${badgeClass}`} title={product.quantity < 5 ? 'Low stock' : 'In stock'}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${isExpiring ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'}`} title={isExpiring ? `Expiring in ${daysToExpiry} days` : 'OK'}>
                            {new Date(product.expiryDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min={1}
                            value={threshold}
                            onChange={e => handleThresholdChange(product._id, Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-yellow-200 rounded focus:ring-2 focus:ring-yellow-400 text-yellow-900 bg-yellow-50"
                          />
                        </td>
                        <td className="py-3 px-4 flex gap-2 justify-center">
                          <Link href={`/products/edit/${product._id}`} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-semibold" title="Edit">
                            ✏️ Edit
                          </Link>
                          <button onClick={() => handleDelete(product._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-semibold" title="Delete">
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    // </RequireAuth>
  );
} 