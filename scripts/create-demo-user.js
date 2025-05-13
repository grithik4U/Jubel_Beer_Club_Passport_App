import { Pool } from '@neondatabase/serverless';
import { createHash, randomBytes } from 'crypto';

// Simple hash function for demo purposes
function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = createHash('sha256')
    .update(password + salt)
    .digest('hex');
  return `${hash}:${salt}`;
}

async function createDemoUser() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log("Connecting to database...");
    
    // Create demo user with hashed password (demo123)
    const password = hashPassword('demo123');
    console.log(`Generated password hash: ${password}`);
    
    // Check if demo user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['demo@jubelbeer.com']
    );
    
    if (existingUser.rows.length > 0) {
      console.log(`Updating existing demo user (id: ${existingUser.rows[0].id})`);
      await pool.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [password, 'demo@jubelbeer.com']
      );
    } else {
      console.log('Creating new demo user');
      await pool.query(
        'INSERT INTO users (email, name, city, total_checkins, password, username) VALUES ($1, $2, $3, $4, $5, $6)',
        ['demo@jubelbeer.com', 'Demo User', 'London', 12, password, 'demouser']
      );
    }
    
    console.log('Demo user created/updated successfully');
    
    // Get the demo user id
    const result = await pool.query(
      'SELECT id, email, password FROM users WHERE email = $1',
      ['demo@jubelbeer.com']
    );
    
    console.log('Demo user details:');
    console.log(result.rows[0]);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

createDemoUser();