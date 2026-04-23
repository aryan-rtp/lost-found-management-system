import mongoose from 'mongoose';

const itemSchema = mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please add an item name']
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['Lost', 'Found'],
    required: true
  },
  location: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  contactInfo: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);