import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  subtotal: number;
}

export interface IOrder extends Document {
  _id: string;
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  customerInfo?: {
    name: string;
    email?: string;
    phone?: string;
  };
  items: IOrderItem[];
  orderType: 'dine-in' | 'delivery' | 'takeout';
  
  // Dine-in specific
  tableNumber?: number;
  
  // Delivery specific
  deliveryAddress?: {
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    instructions?: string;
  };
  
  // Pricing
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  
  // Payment
  paymentMethod: 'online' | 'cash' | 'card';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentDetails?: {
    transactionId?: string;
    eSewaPid?: string;
    eSewaTid?: string;
    paymentGateway?: string;
    paidAt?: Date;
  };
  
  // Order Status
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    note?: string;
    updatedBy?: mongoose.Types.ObjectId;
  }>;
  
  // Timing
  estimatedPrepTime?: number;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  
  // Additional Info
  specialInstructions?: string;
  notes?: string;
  cancellationReason?: string;
  
  // Staff assignments
  assignedTo?: mongoose.Types.ObjectId;  // Chef or delivery person
  
  // Reviews and feedback
  rating?: number;
  review?: string;
  reviewedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  menuItem: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: 200
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const OrderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  customerInfo: {
    name: { type: String, required: true },
    email: String,
    phone: String
  },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: function(items: IOrderItem[]) {
        return items.length > 0;
      },
      message: 'Order must contain at least one item'
    }
  },
  orderType: {
    type: String,
    required: true,
    enum: ['dine-in', 'delivery', 'takeout'],
    index: true
  },
  
  // Dine-in specific
  tableNumber: {
    type: Number,
    min: 1,
    validate: {
      validator: function(this: IOrder, value: number) {
        return this.orderType !== 'dine-in' || value != null;
      },
      message: 'Table number is required for dine-in orders'
    }
  },
  
  // Delivery specific
  deliveryAddress: {
    street: { 
      type: String,
      required: function(this: IOrder) { 
        return this.orderType === 'delivery'; 
      }
    },
    city: { 
      type: String,
      required: function(this: IOrder) { 
        return this.orderType === 'delivery'; 
      }
    },
    state: String,
    zipCode: String,
    phone: String,
    instructions: String
  },
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Payment
  paymentMethod: {
    type: String,
    required: true,
    enum: ['online', 'cash', 'card']
  },
  paymentStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    index: true
  },
  paymentDetails: {
    transactionId: String,
    eSewaPid: String,
    eSewaTid: String,
    paymentGateway: String,
    paidAt: Date
  },
  
  // Order Status
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    index: true
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Timing
  estimatedPrepTime: Number,
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  
  // Additional Info
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: 500
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  cancellationReason: String,
  
  // Staff assignments
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Reviews and feedback
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  reviewedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Generate order number and status history before validation
OrderSchema.pre('validate', function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD${timestamp}${random}`;
  }
  
  // Initialize status history if not exists
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status || 'pending',
      timestamp: new Date(),
      note: 'Order created'
    });
  }
  
  next();
});

// Method to update order status
OrderSchema.methods.updateStatus = function(
  newStatus: string, 
  note?: string, 
  updatedBy?: mongoose.Types.ObjectId
) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
  
  // Update timing based on status
  if (newStatus === 'delivered' && !this.actualDeliveryTime) {
    this.actualDeliveryTime = new Date();
  }
  
  return this.save();
};

// Method to calculate totals
OrderSchema.methods.calculateTotals = function() {
  // Calculate subtotal
  this.subtotal = this.items.reduce(
  (sum: number, item: { subtotal: number }) => sum + item.subtotal,
  0
);

  
  // Set delivery fee based on order type and amount
  if (this.orderType === 'delivery') {
    const freeDeliveryThreshold = parseFloat(process.env.FREE_DELIVERY_THRESHOLD || '50');
    const defaultDeliveryFee = parseFloat(process.env.DEFAULT_DELIVERY_FEE || '5.99');
    
    this.deliveryFee = this.subtotal >= freeDeliveryThreshold ? 0 : defaultDeliveryFee;
  } else {
    this.deliveryFee = 0;
  }
  
  // Calculate tax
  const taxRate = parseFloat(process.env.TAX_RATE || '0.085');
  this.tax = (this.subtotal + this.deliveryFee) * taxRate;
  
  // Calculate total
  this.total = this.subtotal + this.deliveryFee + this.tax;
  
  return this;
};

// Indexes for performance
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ orderType: 1, status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ tableNumber: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model<IOrder>('Order', OrderSchema);
