import mongoose, { Document, Schema } from 'mongoose';

export interface ITable extends Document {
  _id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance' | 'cleaning';
  location?: string;
  description?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  
  // Current occupancy
  currentOrder?: mongoose.Types.ObjectId;
  currentReservation?: mongoose.Types.ObjectId;
  occupiedAt?: Date;
  expectedVacantAt?: Date;
  
  // Service information
  lastCleaned?: Date;
  assignedWaiter?: mongoose.Types.ObjectId;
  
  // Configuration
  isActive: boolean;
  features: string[]; // e.g., 'window-view', 'wheelchair-accessible', 'private'
  
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema = new Schema<ITable>({
  number: {
    type: Number,
    required: [true, 'Table number is required'],
    unique: true,
    min: [1, 'Table number must be positive'],
    max: [parseInt(process.env.MAX_TABLES || '100'), 'Table number exceeds maximum']
  },
  capacity: {
    type: Number,
    required: [true, 'Table capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [20, 'Capacity cannot exceed 20']
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance', 'cleaning'],
    default: 'available'
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location description too long']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description too long']
  },
  qrCode: {
    type: String,
    index: true
  },
  qrCodeUrl: {
    type: String
  },
  
  // Current occupancy
  currentOrder: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  currentReservation: {
    type: Schema.Types.ObjectId,
    ref: 'Reservation'
  },
  occupiedAt: Date,
  expectedVacantAt: Date,
  
  // Service information
  lastCleaned: Date,
  assignedWaiter: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Configuration
  isActive: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String,
    enum: [
      'window-view',
      'wheelchair-accessible', 
      'private',
      'outdoor',
      'booth',
      'bar-height',
      'family-friendly',
      'romantic'
    ]
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for display status
TableSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    available: 'Available',
    occupied: 'Occupied',
    reserved: 'Reserved',
    maintenance: 'Under Maintenance',
    cleaning: 'Being Cleaned'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for QR code URL
TableSchema.virtual('qrCodeMenuUrl').get(function() {
  const baseUrl = process.env.QR_CODE_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/menu?table=${this.number}`;
});

// Method to occupy table
TableSchema.methods.occupy = function(
  order?: mongoose.Types.ObjectId,
  reservation?: mongoose.Types.ObjectId,
  expectedDuration?: number
) {
  this.status = 'occupied';
  this.occupiedAt = new Date();
  
  if (order) this.currentOrder = order;
  if (reservation) this.currentReservation = reservation;
  
  if (expectedDuration) {
    this.expectedVacantAt = new Date(Date.now() + expectedDuration * 60000); // duration in minutes
  }
  
  return this.save();
};

// Method to make table available
TableSchema.methods.makeAvailable = function() {
  this.status = 'available';
  this.currentOrder = undefined;
  this.currentReservation = undefined;
  this.occupiedAt = undefined;
  this.expectedVacantAt = undefined;
  return this.save();
};

// Method to reserve table
TableSchema.methods.reserve = function(reservation: mongoose.Types.ObjectId) {
  this.status = 'reserved';
  this.currentReservation = reservation;
  return this.save();
};

// Method to mark for cleaning
TableSchema.methods.markForCleaning = function() {
  this.status = 'cleaning';
  return this.save();
};

// Method to complete cleaning
TableSchema.methods.completeCleaning = function() {
  this.status = 'available';
  this.lastCleaned = new Date();
  return this.save();
};

// Method to mark for maintenance
TableSchema.methods.markForMaintenance = function() {
  this.status = 'maintenance';
  return this.save();
};

// Method to complete maintenance
TableSchema.methods.completeMaintenance = function() {
  this.status = 'available';
  return this.save();
};

// Method to assign waiter
TableSchema.methods.assignWaiter = function(waiterId: mongoose.Types.ObjectId) {
  this.assignedWaiter = waiterId;
  return this.save();
};

// Static method to find available tables
TableSchema.statics.findAvailable = function(
  capacity?: number,
  features?: string[]
) {
  const query: any = {
    status: 'available',
    isActive: true
  };
  
  if (capacity) {
    query.capacity = { $gte: capacity };
  }
  
  if (features && features.length > 0) {
    query.features = { $in: features };
  }
  
  return this.find(query).sort({ number: 1 });
};

// Static method to get table statistics
TableSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const total = await this.countDocuments({ isActive: true });
  
  return {
    total,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {})
  };
};

// Indexes for performance
// number has unique at field level
TableSchema.index({ status: 1, isActive: 1 });
TableSchema.index({ capacity: 1, status: 1 });
TableSchema.index({ assignedWaiter: 1 });
TableSchema.index({ currentOrder: 1 });
TableSchema.index({ currentReservation: 1 });

export default mongoose.model<ITable>('Table', TableSchema);
