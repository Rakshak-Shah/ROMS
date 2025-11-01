import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'mains' | 'pasta' | 'desserts' | 'beverages';
  image?: string;
  images?: string[];
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  allergens: string[];
  ingredients: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sodium?: number;
  };
  preparationTime: number; // in minutes
  servingSize: string;
  tags: string[];
  popularity: number;
  rating: number;
  reviewCount: number;
  isSpecial: boolean;
  specialPrice?: number;
  specialValidUntil?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(value: number) {
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      },
      message: 'Price must have at most 2 decimal places'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['appetizers', 'mains', 'pasta', 'desserts', 'beverages'],
      message: 'Category must be one of: appetizers, mains, pasta, desserts, beverages'
    },
    index: true
  },
  image: {
    type: String,
    default: '/placeholder-food.jpg'
  },
  images: [{
    type: String
  }],
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  allergens: [{
    type: String,
    trim: true
  }],
  ingredients: [{
    type: String,
    required: true,
    trim: true
  }],
  nutritionInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 },
    sodium: { type: Number, min: 0 }
  },
  preparationTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [120, 'Preparation time cannot exceed 120 minutes']
  },
  servingSize: {
    type: String,
    required: [true, 'Serving size is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  popularity: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  specialPrice: {
    type: Number,
    min: [0, 'Special price cannot be negative']
  },
  specialValidUntil: Date,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Calculate effective price based on special offers
      const r: any = ret;
      r.effectivePrice = r.isSpecial && r.specialPrice && 
        (!r.specialValidUntil || r.specialValidUntil > new Date()) 
        ? r.specialPrice : r.price;
      return r;
    }
  }
});

// Virtual for effective price
MenuItemSchema.virtual('effectivePrice').get(function() {
  if (this.isSpecial && this.specialPrice && 
      (!this.specialValidUntil || this.specialValidUntil > new Date())) {
    return this.specialPrice;
  }
  return this.price;
});

// Update popularity when ordered
MenuItemSchema.methods.incrementPopularity = function() {
  this.popularity += 1;
  return this.save();
};

// Update rating
MenuItemSchema.methods.updateRating = function(newRating: number, isNewReview: boolean = false) {
  if (isNewReview) {
    const totalRating = this.rating * this.reviewCount + newRating;
    this.reviewCount += 1;
    this.rating = totalRating / this.reviewCount;
  } else {
    const totalRating = this.rating * this.reviewCount;
    this.rating = totalRating / this.reviewCount;
  }
  return this.save();
};

// Indexes for performance
MenuItemSchema.index({ category: 1, isAvailable: 1 });
MenuItemSchema.index({ name: 'text', description: 'text', tags: 'text' });
MenuItemSchema.index({ price: 1 });
MenuItemSchema.index({ rating: -1 });
MenuItemSchema.index({ popularity: -1 });
MenuItemSchema.index({ createdAt: -1 });
MenuItemSchema.index({ isSpecial: 1, specialValidUntil: 1 });

export default mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
