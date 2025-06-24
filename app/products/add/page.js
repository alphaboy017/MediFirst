'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    expiryDate: '',
    manufacturer: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation for required fields (you can add more comprehensive validation)
    for (const field in formData) {
      if (formData[field] === '') {
        setError(`Please fill out the ${field} field.`);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }

      // Product added successfully, redirect to products list
      router.push('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-blue-100 via-white to-blue-200 py-8">
      <div className="w-full max-w-3xl p-4 relative bg-blue-50 rounded-2xl shadow-2xl">
        <Link href="/" className="absolute top-4 right-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-200 transition-all">Home</Link>
        <h1 className="text-3xl font-extrabold mb-4 text-blue-700 drop-shadow">Add New Product</h1>
        <Link href="/products" className="text-blue-500 hover:underline">Back to Products</Link>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-blue-700">Product Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-blue-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-blue-300 bg-white" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-blue-700">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-blue-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-blue-300 bg-white" required></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-bold text-blue-700">Price</label>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-blue-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-blue-300 bg-white" required />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-bold text-blue-700">Quantity</label>
            <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full border border-blue-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-blue-300 bg-white" required />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-blue-700">Category</label>
            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-blue-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-blue-300 bg-white" required />
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-bold text-blue-700">Expiry Date</label>
            <input type="date" name="expiryDate" id="expiryDate" value={formData.expiryDate} onChange={handleChange} className="mt-1 block w-full border border-blue-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-blue-300 bg-white" required />
          </div>
          <div>
            <label htmlFor="manufacturer" className="block text-sm font-bold text-blue-700">Manufacturer</label>
            <input type="text" name="manufacturer" id="manufacturer" value={formData.manufacturer} onChange={handleChange} className="mt-1 block w-full border border-blue-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-blue-300 bg-white" required />
          </div>
          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition-all shadow disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
} 