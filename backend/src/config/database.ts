import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri, {
  maxPoolSize: 10,                // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
  bufferCommands: false,          // Disable mongoose buffering
});


    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Log database name
    logger.info(`Database Name: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Create indexes if they don't exist
    await createIndexes();
    
    // Create admin user if it doesn't exist
    await createInitialAdmin();
    
    // Create sample menu items if they don't exist
    await createSampleData();
    
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

const createIndexes = async (): Promise<void> => {
  try {
    // Import models to ensure indexes are created
    await import('../models/User');
    await import('../models/MenuItem');
    await import('../models/Order');
    await import('../models/Reservation');
    await import('../models/Table');
    await import('../models/Review');
    
    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.error('Error creating database indexes:', error);
  }
};

const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
};

const createInitialAdmin = async (): Promise<void> => {
  try {
    const { createAdminUser } = await import('../controllers/authController');
    await createAdminUser();
  } catch (error) {
    logger.error('Error creating initial admin user:', error);
  }
};

const createSampleData = async (): Promise<void> => {
  try {
    const { createSampleMenuItems } = await import('../controllers/menuController');
    await createSampleMenuItems();
  } catch (error) {
    logger.error('Error creating sample menu items:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

export { connectDB, disconnectDB };
