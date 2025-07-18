require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing database connection...');
    console.log('📊 Using DATABASE_URL from environment variables');
    
    // Test the connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('📋 Query result:', result);
    
    // Get database info
    const dbInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as postgres_version,
        current_timestamp as connection_time
    `;
    
    console.log('📊 Database information:');
    console.log('   Database:', dbInfo[0].database_name);
    console.log('   User:', dbInfo[0].current_user);
    console.log('   PostgreSQL Version:', dbInfo[0].postgres_version);
    console.log('   Connection Time:', dbInfo[0].connection_time);
    
    return true;
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('   Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure your SSH tunnel is running:');
      console.error('   npm run tunnel:win  # Windows');
      console.error('   npm run tunnel      # Unix/Linux/macOS');
    }
    
    if (error.code === 'P1001') {
      console.error('💡 Check your DATABASE_URL environment variable');
    }
    
    return false;
    
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }); 