import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema({
  formId: { type: String, required: true, index: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  email: { type: String },
  submittedAt: { type: Number, default: Date.now, index: true }
}, {
  timestamps: false
});

// Create indexes for better query performance
ResponseSchema.index({ formId: 1, submittedAt: -1 });

export default mongoose.model('Response', ResponseSchema);

