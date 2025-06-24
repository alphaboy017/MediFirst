import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this product'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this product'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide the quantity'],
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category for this product'],
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide an expiry date'],
  },
  manufacturer: {
    type: String,
    required: [true, 'Please provide the manufacturer name'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema); 