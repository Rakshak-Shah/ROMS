import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  _id: string;
  itemName: string;
  category: 'ingredient' | 'beverage' | 'packaging' | 'supplies';
  quantity: number;
  unit: string; // kg, liters, pieces, etc.
  minimumStock: number;
  reorderQuantity: number;
  costPerUnit: number;
  supplier?: string;
  supplierContact?: string;
  lastRestocked?: Date;
  expiryDate?: Date;
  notes?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
  createdBy: mongoose.Types.ObjectId;
  lastUpdatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [2, 'Item name must be at least 2 characters'],
    maxlength: [100, 'Item name cannot exceed 100 characters'],
    index: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['ingredient', 'beverage', 'packaging', 'supplies'],
    index: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true
  },
  minimumStock: {
    type: Number,
    required: [true, 'Minimum stock level is required'],
    min: [0, 'Minimum stock cannot be negative'],
    default: 10
  },
  reorderQuantity: {
    type: Number,
    required: [true, 'Reorder quantity is required'],
    min: [1, 'Reorder quantity must be at least 1'],
    default: 50
  },
  costPerUnit: {
    type: Number,
    required: [true, 'Cost per unit is required'],
    min: [0, 'Cost cannot be negative']
  },
  supplier: {
    type: String,
    trim: true,
    maxlength: [100, 'Supplier name cannot exceed 100 characters']
  },
  supplierContact: {
    type: String,
    trim: true,
    maxlength: [200, 'Supplier contact cannot exceed 200 characters']
  },
  lastRestocked: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock', 'expired'],
    default: 'in-stock',
    index: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for total value
InventorySchema.virtual('totalValue').get(function() {
  return this.quantity * this.costPerUnit;
});

// Update status based on quantity and expiry
InventorySchema.pre('save', function(next) {
  const now = new Date();
  
  // Check expiry
  if (this.expiryDate && this.expiryDate < now) {
    this.status = 'expired';
  }
  // Check stock levels
  else if (this.quantity === 0) {
    this.status = 'out-of-stock';
  } else if (this.quantity <= this.minimumStock) {
    this.status = 'low-stock';
  } else {
    this.status = 'in-stock';
  }
  
  next();
});

// Method to update quantity
InventorySchema.methods.updateQuantity = function(change: number, updatedBy: mongoose.Types.ObjectId) {
  this.quantity += change;
  this.lastUpdatedBy = updatedBy;
  if (change > 0) {
    this.lastRestocked = new Date();
  }
  return this.save();
};

// Method to restock
InventorySchema.methods.restock = function(quantity: number, updatedBy: mongoose.Types.ObjectId) {
  this.quantity += quantity;
  this.lastRestocked = new Date();
  this.lastUpdatedBy = updatedBy;
  return this.save();
};

// Indexes for performance
InventorySchema.index({ itemName: 1 });
InventorySchema.index({ category: 1, status: 1 });
InventorySchema.index({ status: 1 });
InventorySchema.index({ expiryDate: 1 });
InventorySchema.index({ createdAt: -1 });

export default mongoose.model<IInventory>('Inventory', InventorySchema);

