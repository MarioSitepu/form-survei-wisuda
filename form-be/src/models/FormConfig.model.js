import mongoose from 'mongoose';

const FormFieldSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio'],
    required: true
  },
  required: { type: Boolean, default: false },
  placeholder: { type: String },
  options: [{ type: String }]
}, { _id: false });

const FormConfigSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: 'default-form' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  fields: [FormFieldSchema],
  isPrimary: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now }
}, {
  timestamps: false
});

// Update updatedAt before saving
FormConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('FormConfig', FormConfigSchema);

