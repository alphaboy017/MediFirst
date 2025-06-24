import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Bill from '@/app/models/Bill';

// GET single bill
export async function GET(request, { params }) {
  try {
    await connectDB();
    const bill = await Bill.findById(params.id).populate('items.product');
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }
    return NextResponse.json(bill);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE bill
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const bill = await Bill.findByIdAndDelete(params.id);
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 