const { promisePool } = require('../config/database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const [adminExists] = await promisePool.execute(
      'SELECT id FROM users WHERE username = ?',
      ['admin']
    );

    if (adminExists.length === 0) {
      await promisePool.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@bracastore.com', adminPassword, 'admin']
      );
      console.log('Admin user created: username=admin, password=admin123');
    }

    // Seed categories
    const categories = ['T-Shirt', 'Training', 'Memorabilia'];
    for (const categoryName of categories) {
      const [categoryExists] = await promisePool.execute(
        'SELECT id FROM categories WHERE name = ?',
        [categoryName]
      );
      if (categoryExists.length === 0) {
        await promisePool.execute(
          'INSERT INTO categories (name) VALUES (?)',
          [categoryName]
        );
      }
    }
    console.log('Categories seeded');

    // Check if products already exist
    const [existingProducts] = await promisePool.execute('SELECT COUNT(*) as count FROM products');
    
    if (existingProducts[0].count === 0) {
      // Seed products
      const products = [
        {
          name: 'Product 1',
          description: 'High-quality product from Braca Store',
          price: 79.99,
          category: 'T-Shirt',
          image_url: '/images/top1.png',
          stock: 50
        },
        {
          name: 'Product 2',
          description: 'Premium training gear',
          price: 99.99,
          category: 'Training',
          image_url: '/images/top2.png',
          stock: 30
        },
        {
          name: 'Product 3',
          description: 'Exclusive memorabilia item',
          price: 49.99,
          category: 'Memorabilia',
          image_url: '/images/top3.png',
          stock: 20
        },
        {
          name: 'Product 4',
          description: 'Comfortable and stylish t-shirt',
          price: 39.99,
          category: 'T-Shirt',
          image_url: '/images/top4.png',
          stock: 40
        },
        {
          name: 'Product 5',
          description: 'Limited edition t-shirt',
          price: 199.99,
          category: 'T-Shirt',
          image_url: '/images/top5.png',
          stock: 15
        },
        {
          name: 'Product 6',
          description: 'Rare collectible memorabilia',
          price: 199.99,
          category: 'Memorabilia',
          image_url: '/images/top6.png',
          stock: 10
        },
        {
          name: 'Product 7',
          description: 'Exclusive memorabilia piece',
          price: 199.99,
          category: 'Memorabilia',
          image_url: '/images/top7.png',
          stock: 12
        },
        {
          name: 'Product 8',
          description: 'Professional training equipment',
          price: 799.99,
          category: 'Training',
          image_url: '/images/top8.png',
          stock: 8
        },
        {
          name: 'Product 9',
          description: 'Premium training gear set',
          price: 899.99,
          category: 'Training',
          image_url: '/images/top9.png',
          stock: 5
        }
      ];

      for (const product of products) {
        await promisePool.execute(
          'INSERT INTO products (name, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
          [product.name, product.description, product.price, product.category, product.image_url, product.stock]
        );
      }

      console.log(`Seeded ${products.length} products`);
    } else {
      console.log('Products already exist, skipping seed');
    }

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();


