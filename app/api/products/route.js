import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Product from '@/app/models/Product';

// GET all products
export async function GET(request) {
  try {
    await connectDB();
    const products = await Product.find({});
    const { searchParams } = new URL(request.url);
    const threshold = parseInt(searchParams.get('expiryThreshold')) || 30;
    const now = new Date();
    const inThreshold = new Date(now.getTime() + threshold * 24 * 60 * 60 * 1000);
    const expiringProducts = products.filter(p => new Date(p.expiryDate) <= inThreshold && new Date(p.expiryDate) >= now);
    return NextResponse.json({ products, expiringProducts });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new product
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 