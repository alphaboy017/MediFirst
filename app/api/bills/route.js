import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Bill from '@/app/models/Bill';
import Product from '@/app/models/Product';

// GET all bills
export async function GET() {
  try {
    await connectDB();
    const bills = await Bill.find({}).populate('items.product');
    return NextResponse.json(bills);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new bill
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Update product quantities
    for (const item of body.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.product} not found` },
          { status: 404 }
        );
      }
      
      if (product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient quantity for product ${product.name}` },
          { status: 400 }
        );
      }
      
      product.quantity -= item.quantity;
      await product.save();
    }
    
    const bill = await Bill.create(body);
    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 