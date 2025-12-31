import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a complaint title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Service', 'Technical', 'Staff', 'Delivery', 'Billing', 'Other']
  },
  priority: {
    type: String,
    required: [true, 'Please set a priority level'],
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In-Progress', 'Resolved', 'Closed'],
    default: 'Pending'
  },
  assignedTo: {
    department: {
      type: String,
      trim: true
    },
    staffName: {
      type: String,
      trim: true
    }
  },
  adminResponse: {
    type: String,
    trim: true
  },
  resolvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

complaintSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;

