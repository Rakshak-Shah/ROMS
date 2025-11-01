import { Request, Response, NextFunction } from 'express';
import MenuItem from '../models/MenuItem';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

// Get all menu items (public)
export const getAllMenuItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, available = true } = req.query;
    
    const filter: any = { isAvailable: available === 'true' };
    if (category) {
      filter.category = category;
    }

    const menuItems = await MenuItem.find(filter)
      .populate('createdBy', 'name')
      .sort({ category: 1, name: 1 });

    res.status(200).json({
      status: 'success',
      results: menuItems.length,
      data: {
        menuItems
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single menu item
export const getMenuItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const menuItem = await MenuItem.findById(id)
      .populate('createdBy', 'name');

    if (!menuItem) {
      const error = new Error('Menu item not found') as any;
      error.statusCode = 404;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      data: {
        menuItem
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get menu items by category
export const getMenuItemsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params as { category?: string };
    const { available = true } = req.query;

    const validCategories = ['appetizers', 'mains', 'pasta', 'desserts', 'beverages'];
    if (!category || !validCategories.includes(category)) {
      const error = new Error('Invalid category') as any;
      error.statusCode = 400;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    const menuItems = await MenuItem.find({
      category,
      isAvailable: available === 'true'
    })
      .populate('createdBy', 'name')
      .sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      results: menuItems.length,
      data: {
        menuItems
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create sample menu items (for testing)
export const createSampleMenuItems = async () => {
  try {
    const existingItems = await MenuItem.countDocuments();
    if (existingItems > 0) {
      logger.info('Menu items already exist');
      return;
    }

    // Find admin user to set as creator
    const User = (await import('../models/User')).default;
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      logger.error('No admin user found to create menu items');
      return;
    }

    const sampleItems = [
      // Appetizers
      {
        name: 'Bruschetta al Pomodoro',
        description: 'Toasted bread topped with fresh tomatoes, basil, garlic, and extra virgin olive oil',
        price: 12.99,
        category: 'appetizers',
        image: '/placeholder-food.jpg',
        preparationTime: 10,
        servingSize: '4 pieces',
        ingredients: ['bread', 'tomatoes', 'basil', 'garlic', 'olive oil'],
        isVegetarian: true,
        createdBy: adminUser._id
      },
      {
        name: 'Calamari Fritti',
        description: 'Crispy fried squid rings served with marinara sauce and lemon',
        price: 15.99,
        category: 'appetizers',
        preparationTime: 15,
        servingSize: '300g',
        ingredients: ['squid', 'flour', 'marinara sauce', 'lemon'],
        createdBy: adminUser._id
      },
      // Main Courses
      {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon grilled to perfection with lemon herb butter',
        price: 28.99,
        category: 'mains',
        preparationTime: 20,
        servingSize: '250g',
        ingredients: ['salmon', 'lemon', 'herbs', 'butter'],
        createdBy: adminUser._id
      },
      {
        name: 'Ribeye Steak',
        description: '12oz prime ribeye steak grilled to your liking with garlic mashed potatoes',
        price: 35.99,
        category: 'mains',
        preparationTime: 25,
        servingSize: '340g',
        ingredients: ['ribeye steak', 'potatoes', 'garlic', 'butter'],
        createdBy: adminUser._id
      },
      // Pasta
      {
        name: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper',
        price: 19.99,
        category: 'pasta',
        preparationTime: 15,
        servingSize: '300g',
        ingredients: ['spaghetti', 'eggs', 'parmesan', 'pancetta', 'black pepper'],
        createdBy: adminUser._id
      },
      {
        name: 'Fettuccine Alfredo',
        description: 'Fresh fettuccine pasta in a rich, creamy parmesan sauce',
        price: 17.99,
        category: 'pasta',
        preparationTime: 12,
        servingSize: '300g',
        ingredients: ['fettuccine', 'cream', 'parmesan', 'butter'],
        isVegetarian: true,
        createdBy: adminUser._id
      },
      // Desserts
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
        price: 9.99,
        category: 'desserts',
        preparationTime: 5,
        servingSize: '1 slice',
        ingredients: ['ladyfingers', 'coffee', 'mascarpone', 'cocoa'],
        isVegetarian: true,
        createdBy: adminUser._id
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream',
        price: 8.99,
        category: 'desserts',
        preparationTime: 15,
        servingSize: '1 cake',
        ingredients: ['chocolate', 'flour', 'eggs', 'vanilla ice cream'],
        isVegetarian: true,
        createdBy: adminUser._id
      },
      // Beverages
      {
        name: 'House Wine (Glass)',
        description: 'Red or white wine from our carefully selected house collection',
        price: 8.99,
        category: 'beverages',
        preparationTime: 2,
        servingSize: '150ml',
        ingredients: ['wine'],
        createdBy: adminUser._id
      },
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 4.99,
        category: 'beverages',
        preparationTime: 5,
        servingSize: '300ml',
        ingredients: ['oranges'],
        isVegetarian: true,
        isVegan: true,
        createdBy: adminUser._id
      }
    ];

    await MenuItem.insertMany(sampleItems);
    logger.info(`Created ${sampleItems.length} sample menu items`);
  } catch (error) {
    logger.error('Error creating sample menu items:', error);
  }
};

// Admin only - Create new menu item
export const createMenuItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const menuItemData = {
      ...req.body,
      createdBy: req.user!._id
    };

    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();

    res.status(201).json({
      status: 'success',
      message: 'Menu item created successfully',
      data: {
        menuItem
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin only - Update menu item
export const updateMenuItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const menuItem = await MenuItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!menuItem) {
      const error = new Error('Menu item not found') as any;
      error.statusCode = 404;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      message: 'Menu item updated successfully',
      data: {
        menuItem
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin only - Delete menu item
export const deleteMenuItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      const error = new Error('Menu item not found') as any;
      error.statusCode = 404;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    res.status(204).json({
      status: 'success',
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
