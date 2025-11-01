import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  _id: string;
  customer: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  menuItem?: mongoose.Types.ObjectId;
  
  // Review content
  rating: number;
  title?: string;
  comment: string;
  
  // Review metadata
  isVerified: boolean;
  isPublished: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationNotes?: string;
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  
  // Helpful votes
  helpfulVotes: number;
  reportCount: number;
  
  // Response from restaurant
  response?: {
    content: string;
    respondedBy: mongoose.Types.ObjectId;
    respondedAt: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  menuItem: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem'
  },
  
  // Review content
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  
  // Review metadata
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: function() {
      return process.env.REVIEW_MODERATION_ENABLED === 'true' ? 'pending' : 'approved';
    }
  },
  moderationNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  moderatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  
  // Helpful votes
  helpfulVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  reportCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Response from restaurant
  response: {
    content: {
      type: String,
      trim: true,
      maxlength: [500, 'Response cannot exceed 500 characters']
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for display rating
ReviewSchema.virtual('displayRating').get(function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

// Virtual for review age
ReviewSchema.virtual('reviewAge').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Method to approve review
ReviewSchema.methods.approve = function(moderatorId: mongoose.Types.ObjectId, notes?: string) {
  this.moderationStatus = 'approved';
  this.isPublished = true;
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  if (notes) this.moderationNotes = notes;
  return this.save();
};

// Method to reject review
ReviewSchema.methods.reject = function(moderatorId: mongoose.Types.ObjectId, notes: string) {
  this.moderationStatus = 'rejected';
  this.isPublished = false;
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  this.moderationNotes = notes;
  return this.save();
};

// Method to flag review
ReviewSchema.methods.flag = function(moderatorId: mongoose.Types.ObjectId, notes: string) {
  this.moderationStatus = 'flagged';
  this.isPublished = false;
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  this.moderationNotes = notes;
  return this.save();
};

// Method to add helpful vote
ReviewSchema.methods.addHelpfulVote = function() {
  this.helpfulVotes += 1;
  return this.save();
};

// Method to report review
ReviewSchema.methods.report = function() {
  this.reportCount += 1;
  
  // Auto-flag if too many reports
  const maxReports = parseInt(process.env.MAX_REPORTS_BEFORE_FLAG || '5');
  if (this.reportCount >= maxReports) {
    this.moderationStatus = 'flagged';
    this.isPublished = false;
  }
  
  return this.save();
};

// Method to add restaurant response
ReviewSchema.methods.addResponse = function(
  content: string,
  respondedBy: mongoose.Types.ObjectId
) {
  this.response = {
    content,
    respondedBy,
    respondedAt: new Date()
  };
  return this.save();
};

// Static method to get average rating for a menu item
ReviewSchema.statics.getAverageRating = async function(menuItemId: mongoose.Types.ObjectId) {
  const result = await this.aggregate([
    {
      $match: {
        menuItem: menuItemId,
        isPublished: true,
        moderationStatus: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
};

// Static method to get review statistics
ReviewSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  const totalReviews = await this.countDocuments();
  const averageRating = await this.aggregate([
    {
      $group: {
        _id: null,
        average: { $avg: '$rating' }
      }
    }
  ]);

  return {
    totalReviews,
    averageRating: averageRating.length > 0 ? averageRating[0].average : 0,
    ratingDistribution: stats
  };
};

// Pre-save middleware to verify customer has ordered
ReviewSchema.pre('save', async function(next) {
  if (this.isNew && this.order) {
    const Order = mongoose.model('Order');
    const order = await Order.findOne({
      _id: this.order,
      customer: this.customer,
      status: 'delivered'
    });
    
    if (order) {
      this.isVerified = true;
    }
  }
  next();
});

// Indexes for performance
ReviewSchema.index({ customer: 1, createdAt: -1 });
ReviewSchema.index({ menuItem: 1, rating: -1 });
ReviewSchema.index({ order: 1 });
ReviewSchema.index({ moderationStatus: 1, isPublished: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ helpfulVotes: -1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
