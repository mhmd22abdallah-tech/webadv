const { promisePool } = require('../config/database');
const bcrypt = require('bcryptjs');

const resetAdminPassword = async () => {
  try {
    console.log('Resetting admin password...');

    // Hash the password
    const adminPassword = await bcrypt.hash('admin123', 10);
    console.log('Password hashed successfully');

    // Check if admin exists
    const [adminExists] = await promisePool.execute(
      'SELECT id FROM users WHERE username = ?',
      ['admin']
    );

    if (adminExists.length === 0) {
      // Create admin user if doesn't exist
      await promisePool.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@bracastore.com', adminPassword, 'admin']
      );
      console.log('Admin user created successfully');
    } else {
      // Update existing admin password
      await promisePool.execute(
        'UPDATE users SET password = ? WHERE username = ?',
        [adminPassword, 'admin']
      );
      console.log('Admin password updated successfully');
    }

    console.log('\n✅ Admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\nYou can now login with these credentials!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin password:', error);
    process.exit(1);
  }
};

resetAdminPassword();

