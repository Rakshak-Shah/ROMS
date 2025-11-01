import mongoose from 'mongoose';
import User from './models/User';
import MenuItem from './models/MenuItem';
import Table from './models/Table';
import Order from './models/Order';
import Reservation from './models/Reservation';
import Review from './models/Review';
import { config } from 'dotenv';

// Load environment variables
config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/roms';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Table.deleteMany({});
    await Order.deleteMany({});
    await Reservation.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    // Note: Password will be hashed by User model's pre-save hook
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@roms.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
      isActive: true,
      isEmailVerified: true,
      addresses: [
        {
          id: '1',
          type: 'home',
          address: '123 Admin Street',
          city: 'Admin City',
          state: 'AC',
          zipCode: '12345',
          isDefault: true
        }
      ],
      preferences: {
        notifications: true,
        newsletter: true,
        deliveryAddress: '123 Admin Street, Admin City, AC 12345'
      }
    });
    console.log('Created admin user');

    // Create staff user
    const staffUser = await User.create({
      name: 'Staff Member',
      email: 'staff@roms.com',
      password: 'admin123',
      role: 'staff',
      phone: '+1234567891',
      isActive: true,
      isEmailVerified: true,
      addresses: [
        {
          id: '1',
          type: 'work',
          address: '456 Staff Avenue',
          city: 'Staff City',
          state: 'SC',
          zipCode: '54321',
          isDefault: true
        }
      ],
      preferences: {
        notifications: true,
        newsletter: false,
        deliveryAddress: '456 Staff Avenue, Staff City, SC 54321'
      }
    });
    console.log('Created staff user');

    // Create customer users
    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'admin123',
      role: 'customer',
      phone: '+1234567892',
      isActive: true,
      isEmailVerified: true,
      addresses: [
        {
          id: '1',
          type: 'home',
          address: '789 Customer Lane',
          city: 'Customer City',
          state: 'CC',
          zipCode: '67890',
          isDefault: true
        }
      ],
      preferences: {
        notifications: true,
        newsletter: true,
        deliveryAddress: '789 Customer Lane, Customer City, CC 67890'
      }
    });

    const customer2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'admin123',
      role: 'customer',
      phone: '+1234567893',
      isActive: true,
      isEmailVerified: true,
      addresses: [
        {
          id: '1',
          type: 'home',
          address: '321 Smith Street',
          city: 'Smith City',
          state: 'SC',
          zipCode: '09876',
          isDefault: true
        }
      ],
      preferences: {
        notifications: true,
        newsletter: false,
        deliveryAddress: '321 Smith Street, Smith City, SC 09876'
      }
    });
    console.log('Created customer users');

    // Create menu items
    const menuItems = await MenuItem.create([
      // Appetizers
      {
        name: 'Bruschetta',
        description: 'Toasted bread topped with fresh tomatoes, basil, and garlic',
        category: 'appetizers',
        price: 8.99,
        image: '/images/bruschetta.jpg',
        ingredients: ['bread', 'tomatoes', 'basil', 'garlic', 'olive oil'],
        allergens: ['gluten'],
        nutritionInfo: {
          calories: 180,
          protein: 4,
          carbs: 22,
          fat: 8
        },
        isAvailable: true,
        preparationTime: 10,
        servingSize: '4 pieces',
        createdBy: adminUser._id,
        isSpecial: false
      },
      {
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce with parmesan cheese and croutons',
        category: 'appetizers',
        price: 12.99,
        image: '/images/caesar-salad.jpg',
        ingredients: ['romaine lettuce', 'parmesan', 'croutons', 'caesar dressing'],
        allergens: ['gluten', 'dairy'],
        nutritionInfo: {
          calories: 250,
          protein: 8,
          carbs: 15,
          fat: 18
        },
        isAvailable: true,
        preparationTime: 8,
        servingSize: '1 large bowl',
        createdBy: adminUser._id,
        isSpecial: false
      },
      {
        name: 'Wings Special',
        description: 'Spicy buffalo wings with blue cheese dip',
        category: 'appetizers',
        price: 14.99,
        image: '/images/wings.jpg',
        ingredients: ['chicken wings', 'buffalo sauce', 'blue cheese'],
        allergens: ['dairy'],
        nutritionInfo: {
          calories: 320,
          protein: 25,
          carbs: 5,
          fat: 22
        },
        isAvailable: true,
        preparationTime: 15,
        servingSize: '8 pieces',
        createdBy: adminUser._id,
        isSpecial: true,
        specialPrice: 11.99,
        specialValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },

      // Main Courses
      {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon herb butter',
        category: 'mains',
        price: 24.99,
        image: '/images/salmon.jpg',
        ingredients: ['salmon', 'lemon', 'herbs', 'butter'],
        allergens: ['fish', 'dairy'],
        nutritionInfo: {
          calories: 380,
          protein: 35,
          carbs: 2,
          fat: 25
        },
        isAvailable: true,
        preparationTime: 20,
        servingSize: '1 fillet',
        createdBy: adminUser._id,
        isSpecial: false
      },
      {
        name: 'Beef Steak',
        description: '8oz ribeye steak cooked to perfection',
        category: 'mains',
        price: 32.99,
        image: '/images/steak.jpg',
        ingredients: ['ribeye steak', 'seasoning', 'herbs'],
        allergens: [],
        nutritionInfo: {
          calories: 450,
          protein: 40,
          carbs: 1,
          fat: 30
        },
        isAvailable: true,
        preparationTime: 25,
        servingSize: '8oz',
        createdBy: adminUser._id,
        isSpecial: false
      },
      {
        name: 'Vegetarian Pasta',
        description: 'Penne pasta with seasonal vegetables in marinara sauce',
        category: 'pasta',
        price: 18.99,
        image: '/images/vegetarian-pasta.jpg',
        ingredients: ['penne pasta', 'tomatoes', 'bell peppers', 'zucchini', 'onions'],
        allergens: ['gluten'],
        nutritionInfo: {
          calories: 320,
          protein: 12,
          carbs: 55,
          fat: 8
        },
        isAvailable: true,
        preparationTime: 15,
        servingSize: '1 large plate',
        createdBy: adminUser._id,
        isSpecial: false
      },

      // Desserts
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        category: 'desserts',
        price: 9.99,
        image: '/images/tiramisu.jpg',
        ingredients: ['mascarpone', 'coffee', 'ladyfingers', 'cocoa'],
        allergens: ['gluten', 'dairy', 'eggs'],
        nutritionInfo: {
          calories: 280,
          protein: 6,
          carbs: 25,
          fat: 18
        },
        isAvailable: true,
        preparationTime: 5,
        servingSize: '1 slice',
        createdBy: adminUser._id,
        isSpecial: false
      },
      {
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with vanilla ice cream',
        category: 'desserts',
        price: 11.99,
        image: '/images/chocolate-cake.jpg',
        ingredients: ['chocolate', 'flour', 'eggs', 'sugar', 'vanilla ice cream'],
        allergens: ['gluten', 'dairy', 'eggs'],
        nutritionInfo: {
          calories: 420,
          protein: 8,
          carbs: 45,
          fat: 22
        },
        isAvailable: true,
        preparationTime: 5,
        servingSize: '1 slice',
        createdBy: adminUser._id,
        isSpecial: true,
        specialPrice: 8.99,
        specialValidUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      },

      // Beverages
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        category: 'beverages',
        price: 4.99,
        image: '/images/orange-juice.jpg',
        ingredients: ['oranges'],
        allergens: [],
        nutritionInfo: {
          calories: 110,
          protein: 2,
          carbs: 26,
          fat: 0
        },
        isAvailable: true,
        preparationTime: 2,
        servingSize: '12oz glass',
        createdBy: adminUser._id,
        isSpecial: false
      },
      {
        name: 'Cappuccino',
        description: 'Rich espresso with steamed milk foam',
        category: 'beverages',
        price: 5.99,
        image: '/images/cappuccino.jpg',
        ingredients: ['espresso', 'milk'],
        allergens: ['dairy'],
        nutritionInfo: {
          calories: 80,
          protein: 4,
          carbs: 6,
          fat: 4
        },
        isAvailable: true,
        preparationTime: 3,
        servingSize: '8oz cup',
        createdBy: adminUser._id,
        isSpecial: false
      }
    ]);
    console.log('Created menu items');

    // Create tables
    const tables = await Table.create([
      {
        number: 1,
        capacity: 2,
        location: 'Window Side',
        status: 'available',
        qrCode: 'TABLE-1-QR'
      },
      {
        number: 2,
        capacity: 4,
        location: 'Center',
        status: 'available',
        qrCode: 'TABLE-2-QR'
      },
      {
        number: 3,
        capacity: 6,
        location: 'Back Corner',
        status: 'occupied',
        qrCode: 'TABLE-3-QR'
      },
      {
        number: 4,
        capacity: 2,
        location: 'Window Side',
        status: 'available',
        qrCode: 'TABLE-4-QR'
      },
      {
        number: 5,
        capacity: 8,
        location: 'Private Section',
        status: 'reserved',
        qrCode: 'TABLE-5-QR'
      },
      {
        number: 6,
        capacity: 4,
        location: 'Center',
        status: 'available',
        qrCode: 'TABLE-6-QR'
      }
    ]);
    console.log('Created tables');

    // Create sample orders
    const bruschetta = menuItems[0];
    const caesarSalad = menuItems[1];
    const salmon = menuItems[3];
    const vegetarianPasta = menuItems[5];

    if (!bruschetta || !caesarSalad || !salmon || !vegetarianPasta) {
      throw new Error('Required menu items not found');
    }

    const orders = await Order.create([
      {
        orderNumber: 'ORD-001',
        customer: customer1._id,
        customerInfo: {
          name: customer1.name,
          email: customer1.email,
          phone: customer1.phone
        },
        items: [
          {
            menuItem: bruschetta._id,
            name: bruschetta.name,
            price: bruschetta.price,
            quantity: 2,
            subtotal: bruschetta.price * 2,
            specialInstructions: 'Extra crispy'
          },
          {
            menuItem: salmon._id,
            name: salmon.name,
            price: salmon.price,
            quantity: 1,
            subtotal: salmon.price,
            specialInstructions: 'Medium rare'
          }
        ],
        orderType: 'dine-in',
        tableNumber: 1,
        subtotal: (bruschetta.price * 2) + salmon.price,
        deliveryFee: 0,
        tax: ((bruschetta.price * 2) + salmon.price) * 0.08,
        total: ((bruschetta.price * 2) + salmon.price) * 1.08,
        paymentMethod: 'card',
        paymentStatus: 'completed',
        status: 'delivered',
        specialInstructions: 'Please bring extra napkins',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            note: 'Order placed',
            updatedBy: customer1._id
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
            note: 'Order confirmed by kitchen',
            updatedBy: staffUser._id
          },
          {
            status: 'preparing',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            note: 'Food is being prepared',
            updatedBy: staffUser._id
          },
          {
            status: 'ready',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            note: 'Order is ready for pickup',
            updatedBy: staffUser._id
          },
          {
            status: 'delivered',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            note: 'Order delivered to table',
            updatedBy: staffUser._id
          }
        ]
      },
      {
        orderNumber: 'ORD-002',
        customer: customer2._id,
        customerInfo: {
          name: customer2.name,
          email: customer2.email,
          phone: customer2.phone
        },
        items: [
          {
            menuItem: caesarSalad._id,
            name: caesarSalad.name,
            price: caesarSalad.price,
            quantity: 1,
            subtotal: caesarSalad.price,
            specialInstructions: 'Dressing on the side'
          },
          {
            menuItem: vegetarianPasta._id,
            name: vegetarianPasta.name,
            price: vegetarianPasta.price,
            quantity: 1,
            subtotal: vegetarianPasta.price,
            specialInstructions: 'Extra vegetables'
          }
        ],
        orderType: 'delivery',
        deliveryAddress: {
          street: '321 Smith Street',
          city: 'Smith City',
          state: 'SC',
          zipCode: '09876'
        },
        subtotal: caesarSalad.price + vegetarianPasta.price,
        deliveryFee: 5.99,
        tax: (caesarSalad.price + vegetarianPasta.price + 5.99) * 0.08,
        total: (caesarSalad.price + vegetarianPasta.price + 5.99) * 1.08,
        paymentMethod: 'online',
        paymentStatus: 'completed',
        status: 'preparing',
        specialInstructions: 'Ring doorbell twice',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            note: 'Order placed',
            updatedBy: customer2._id
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 40 * 60 * 1000),
            note: 'Order confirmed',
            updatedBy: staffUser._id
          },
          {
            status: 'preparing',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            note: 'Food is being prepared',
            updatedBy: staffUser._id
          }
        ]
      }
    ]);
    console.log('Created sample orders');

    // Create sample reservations
    const reservations = await Reservation.create([
      {
        confirmationCode: 'RES-001',
        customer: customer1._id,
        customerInfo: {
          name: customer1.name,
          email: customer1.email,
          phone: customer1.phone
        },
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: '7:00 PM',
        guests: 2,
        status: 'confirmed',
        tableNumber: 1,
        specialRequests: 'Window table preferred',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            note: 'Reservation requested',
            updatedBy: customer1._id
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            note: 'Reservation confirmed',
            updatedBy: staffUser._id
          }
        ]
      },
      {
        confirmationCode: 'RES-002',
        customer: customer2._id,
        customerInfo: {
          name: customer2.name,
          email: customer2.email,
          phone: customer2.phone
        },
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        time: '8:30 PM',
        guests: 4,
        status: 'pending',
        specialRequests: 'Birthday celebration',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            note: 'Reservation requested',
            updatedBy: customer2._id
          }
        ]
      }
    ]);
    console.log('Created sample reservations');

    // Create sample reviews
    const firstOrder = orders[0];
    const secondOrder = orders[1];

    if (!firstOrder || !secondOrder) {
      throw new Error('Required orders not found');
    }

    const reviews = await Review.create([
      {
        customer: customer1._id,
        order: firstOrder._id,
        menuItem: bruschetta._id,
        rating: 5,
        title: 'Excellent Bruschetta!',
        comment: 'The bruschetta was absolutely delicious. Fresh ingredients and perfect seasoning. Will definitely order again!',
        isVerified: true,
        isPublished: true,
        moderationStatus: 'approved',
        helpfulVotes: 3,
        reportCount: 0,
        response: {
          content: 'Thank you for your wonderful feedback! We\'re thrilled you enjoyed our bruschetta.',
          author: staffUser._id,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      },
      {
        customer: customer1._id,
        order: firstOrder._id,
        menuItem: salmon._id,
        rating: 4,
        title: 'Great Salmon',
        comment: 'The grilled salmon was cooked perfectly. Very fresh and flavorful. Only minor issue was it took a bit longer than expected.',
        isVerified: true,
        isPublished: true,
        moderationStatus: 'approved',
        helpfulVotes: 1,
        reportCount: 0
      },
      {
        customer: customer2._id,
        order: secondOrder._id,
        menuItem: caesarSalad._id,
        rating: 3,
        title: 'Decent Caesar Salad',
        comment: 'The salad was good but nothing special. Dressing was a bit too heavy for my taste.',
        isVerified: true,
        isPublished: true,
        moderationStatus: 'approved',
        helpfulVotes: 0,
        reportCount: 0
      }
    ]);
    console.log('Created sample reviews');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${await User.countDocuments()}`);
    console.log(`🍽️  Menu Items: ${await MenuItem.countDocuments()}`);
    console.log(`🪑 Tables: ${await Table.countDocuments()}`);
    console.log(`📦 Orders: ${await Order.countDocuments()}`);
    console.log(`📅 Reservations: ${await Reservation.countDocuments()}`);
    console.log(`⭐ Reviews: ${await Review.countDocuments()}`);
    
    console.log('\n🔑 Test Accounts:');
    console.log('Admin: admin@roms.com / admin123');
    console.log('Staff: staff@roms.com / admin123');
    console.log('Customer 1: john@example.com / admin123');
    console.log('Customer 2: jane@example.com / admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedData();
