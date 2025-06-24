'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateBillPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [billItems, setBillItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(Array.isArray(data.products) ? data.products : []);
        if (data.products && data.products.length > 0) {
          setSelectedProduct(data.products[0]._id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAddItem = () => {
    const productToAdd = products.find(p => p._id === selectedProduct);
    if (!productToAdd) return;

    // Check if product is already in the bill items
    const existingItemIndex = billItems.findIndex(item => item.product._id === selectedProduct);

    if (existingItemIndex > -1) {
      // Update quantity if product already exists
      const updatedBillItems = [...billItems];
      updatedBillItems[existingItemIndex].quantity += quantity;
      updatedBillItems[existingItemIndex].price = updatedBillItems[existingItemIndex].quantity * productToAdd.price;
      setBillItems(updatedBillItems);
    } else {
      // Add new item
      setBillItems([
        ...billItems,
        {
          product: productToAdd,
          quantity: quantity,
          price: quantity * productToAdd.price,
        },
      ]);
    }

    // Reset quantity and selected product
    setQuantity(1);
    if (products.length > 0) {
      setSelectedProduct(products[0]._id);
    }
  };

  const handleRemoveItem = (index) => {
    const updatedBillItems = billItems.filter((_, i) => i !== index);
    setBillItems(updatedBillItems);
  };

  const calculateTotalAmount = () => {
    return billItems.reduce((total, item) => total + item.price, 0);
  };

  const handleSubmitBill = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);

    if (!customerName) {
        setSubmitError('Please enter customer name.');
        setSubmitLoading(false);
        return;
    }

    if (billItems.length === 0) {
        setSubmitError('Please add items to the bill.');
        setSubmitLoading(false);
        return;
    }

    const billData = {
      customerName,
      items: billItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price, // This is the total price for this item line
      })),
      totalAmount: calculateTotalAmount(),
      paymentMethod,
    };

    try {
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create bill');
      }

      // Bill created successfully, redirect or show success message
      alert('Bill created successfully!');
      // Optionally clear the form or redirect
      setBillItems([]);
      setCustomerName('');
      setPaymentMethod('Cash');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading products...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error loading products: {error}</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-blue-100 via-white to-blue-200 py-8">
      <div className="w-full max-w-3xl p-4 sm:p-8 relative bg-blue-50 rounded-3xl shadow-2xl">
        <Link href="/" className="absolute top-4 right-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-200 transition-all">Home</Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-blue-800 drop-shadow">Create New Bill</h1>

        {/* Add Item Section */}
        <div className="mb-8 bg-blue-100/60 rounded-xl shadow border border-blue-200 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center"><span className="border-l-4 border-blue-600 pr-2 mr-2 h-6"></span><span className="text-blue-800">Add Item to Bill</span></h2>
          {(!Array.isArray(products) || products.length === 0) ? (
            <div className="text-red-500 font-semibold mb-2">
              No products available. <Link href="/products" className="underline text-blue-600 hover:text-blue-800">Add products</Link> first.
            </div>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <select 
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="border border-blue-300 rounded-lg shadow-sm p-2 w-44 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-blue-300 bg-blue-50 focus:bg-white transition-all"
              disabled={!Array.isArray(products) || products.length === 0}
            >
              {Array.isArray(products) && products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} ({product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}) - Stock: {product.quantity}
                </option>
              ))}
            </select>
            <input 
              type="number" 
              min="1" 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border border-blue-300 rounded-lg shadow-sm p-2 w-20 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-blue-300 bg-blue-50 focus:bg-white transition-all"
              disabled={!Array.isArray(products) || products.length === 0}
            />
            <button 
              onClick={handleAddItem}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold shadow-md hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-400 transition-all"
              disabled={!Array.isArray(products) || products.length === 0}
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Bill Details Section */}
        <div className="mb-8 bg-blue-100/60 rounded-xl shadow border border-blue-200 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center"><span className="border-l-4 border-blue-600 pr-2 mr-2 h-6"></span><span className="text-blue-800">Bill Details</span></h2>
          <div className="mb-4">
            <label htmlFor="customerName" className="block text-sm font-bold text-blue-700 mb-1">Customer Name</label>
            <input type="text" name="customerName" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1 block w-full border border-blue-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-blue-300 bg-blue-50 focus:bg-white transition-all" required />
          </div>
          {billItems.length === 0 ? (
            <p className="text-gray-400">No items added to the bill yet.</p>
          ) : (
            <ul className="border rounded-md p-4 bg-blue-50">
              {billItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b last:border-b-0 py-2">
                  <div>
                    <p className="font-semibold text-blue-800">{item.product.name}</p>
                    <p className="text-sm text-gray-600">{item.quantity} x {item.product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                  </div>
                  <div className="flex items-center">
                     <p className="font-semibold mr-4 text-green-700">{item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                     <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 text-xl font-bold text-right">
            <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg shadow">Total Amount: {calculateTotalAmount().toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mb-8 bg-blue-100/60 rounded-xl shadow border border-blue-200 p-6">
          <label htmlFor="paymentMethod" className="block text-sm font-bold text-blue-700 mb-1">Payment Method</label>
          <select 
            name="paymentMethod" 
            id="paymentMethod" 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 block w-full border border-blue-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-blue-300 bg-blue-50 focus:bg-white transition-all"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        {submitError && <p className="text-red-500 text-sm mt-4 font-semibold">{submitError}</p>}

        <button 
          onClick={handleSubmitBill} 
          className="mt-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-400 transition-all shadow-md disabled:opacity-50"
          disabled={submitLoading || billItems.length === 0 || !customerName}
        >
          {submitLoading ? 'Creating Bill...' : 'Create Bill'}
        </button>
      </div>
    </div>
  );
} 