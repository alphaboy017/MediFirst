'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });
    if (res.ok) {
      router.push('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      <Link href="/" className="absolute top-6 right-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-200 transition-all">Home</Link>
      <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-extrabold mb-6 text-center text-blue-800 tracking-tight">Admin Login</h1>
        {error && <p className="text-red-500 mb-4 text-center font-semibold">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white placeholder-gray-400"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white placeholder-gray-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition-all shadow"
        >
          Login
        </button>
      </form>
    </div>
  );
} 