import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Please provide customer name'],
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash', 'Card', 'UPI']
  }
});

export default mongoose.models.Bill || mongoose.model('Bill', BillSchema); 