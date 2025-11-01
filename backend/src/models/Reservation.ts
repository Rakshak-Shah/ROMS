import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  _id: string;
  customer: mongoose.Types.ObjectId;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  date: Date;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  tableNumber?: number;
  confirmationCode: string;
  
  // Contact and communication
  reminderSent: boolean;
  reminderSentAt?: Date;
  
  // Staff notes
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;
  
  // Cancellation details
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: mongoose.Types.ObjectId;
  
  // Timing
  arrivedAt?: Date;
  seatedAt?: Date;
  completedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    }
  },
  date: {
    type: Date,
    required: [true, 'Reservation date is required'],
    validate: {
      validator: function(value: Date) {
        // Date should be in the future (at least today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today;
      },
      message: 'Reservation date must be today or in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Reservation time is required'],
    validate: {
      validator: function(value: string) {
        // Validate time format (HH:MM AM/PM)
        return /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/i.test(value);
      },
      message: 'Please provide a valid time in format HH:MM AM/PM'
    }
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'Must have at least 1 guest'],
    max: [parseInt(process.env.MAX_PARTY_SIZE || '10'), 'Party size too large']
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  tableNumber: {
    type: Number,
    min: 1,
    max: parseInt(process.env.MAX_TABLES || '50')
  },
  confirmationCode: {
    type: String,
    required: true,
    unique: true
  },
  
  // Contact and communication
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderSentAt: Date,
  
  // Staff notes
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Cancellation details
  cancellationReason: {
    type: String,
    trim: true,
    maxlength: 200
  },
  cancelledAt: Date,
  cancelledBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Timing
  arrivedAt: Date,
  seatedAt: Date,
  completedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Generate confirmation code before saving
ReservationSchema.pre('save', function(next) {
  if (this.isNew && !this.confirmationCode) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.confirmationCode = `RES${timestamp}${random}`;
  }
  next();
});

// Virtual for formatted date and time
ReservationSchema.virtual('formattedDateTime').get(function() {
  const date = this.date.toLocaleDateString();
  return `${date} at ${this.time}`;
});

// Virtual for status display
ReservationSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Pending Confirmation',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
    'no-show': 'No Show'
  };
  return statusMap[this.status] || this.status;
});

// Method to confirm reservation
ReservationSchema.methods.confirm = function(tableNumber?: number, assignedTo?: mongoose.Types.ObjectId) {
  this.status = 'confirmed';
  if (tableNumber) this.tableNumber = tableNumber;
  if (assignedTo) this.assignedTo = assignedTo;
  return this.save();
};

// Method to cancel reservation
ReservationSchema.methods.cancel = function(
  reason?: string, 
  cancelledBy?: mongoose.Types.ObjectId
) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  this.cancelledBy = cancelledBy;
  return this.save();
};

// Method to mark as arrived
ReservationSchema.methods.markArrived = function() {
  this.arrivedAt = new Date();
  return this.save();
};

// Method to mark as seated
ReservationSchema.methods.markSeated = function() {
  if (!this.arrivedAt) {
    this.arrivedAt = new Date();
  }
  this.seatedAt = new Date();
  return this.save();
};

// Method to complete reservation
ReservationSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Method to mark as no-show
ReservationSchema.methods.markNoShow = function() {
  this.status = 'no-show';
  return this.save();
};

// Static method to find available time slots
ReservationSchema.statics.findAvailableSlots = async function(date: Date, guests: number) {
  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const existingReservations = await this.find({
    date: {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    },
    status: { $in: ['pending', 'confirmed'] }
  });

  // Simple availability check - you can make this more sophisticated
  const unavailableSlots = existingReservations.map((res: IReservation) => res.time);
  return timeSlots.filter(slot => !unavailableSlots.includes(slot));
};

// Indexes for performance
ReservationSchema.index({ date: 1, time: 1 });
ReservationSchema.index({ customer: 1, createdAt: -1 });
ReservationSchema.index({ status: 1, date: 1 });
// confirmationCode has unique at field level
ReservationSchema.index({ tableNumber: 1, date: 1 });
ReservationSchema.index({ createdAt: -1 });

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
