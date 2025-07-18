import { PrismaClient } from '@prisma/client';
import { createTunnel } from 'tunnel-ssh';

// Global variable to store the Prisma client instance
let prisma: PrismaClient | null = null;
let sshTunnel: any = null;

// SSH tunnel configuration from environment variables
const tunnelOptions = {
  autoClose: true,
  reconnectOnError: true
};

const sshOptions = {
  host: process.env.SSH_HOST!,
  port: parseInt(process.env.SSH_PORT || '22'),
  username: process.env.SSH_USER!,
  password: process.env.SSH_PASSWORD!
};

// Server options - automatic assign port by OS
const serverOptions = {
  port: 5432
};

// Forwarding options
const forwardOptions = {
  dstAddr: process.env.SSH_DB_HOST || '127.0.0.1',
  dstPort: parseInt(process.env.SSH_DB_PORT || '5432')
};

/**
 * Creates an SSH tunnel to the remote database
 */
async function createSshTunnel(): Promise<void> {
  // Check if tunnel already exists
  if (sshTunnel) {
    console.log('SSH tunnel already exists');
    return;
  }

  console.log('Creating SSH tunnel...');
  console.log(`Connecting to ${sshOptions.host}:${sshOptions.port} as ${sshOptions.username}`);

  try {
    // Create tunnel using the correct API structure
    const [server, client] = await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
    
    sshTunnel = server;
    console.log(`SSH tunnel established: localhost:${serverOptions.port} -> ${forwardOptions.dstAddr}:${forwardOptions.dstPort}`);
    
    // Handle tunnel errors
    server.on('error', (error: any) => {
      console.error('SSH tunnel error:', error);
    });
    
  } catch (error) {
    console.error('SSH tunnel creation failed:', error);
    throw error;
  }
}

/**
 * Closes the SSH tunnel
 */
export async function closeSshTunnel(): Promise<void> {
  if (sshTunnel) {
    sshTunnel.close();
    sshTunnel = null;
    console.log('SSH tunnel closed');
  }
}

/**
 * Gets or creates a Prisma client instance with SSH tunnel
 */
export async function getPrismaClient(): Promise<PrismaClient> {
  if (!prisma) {
    try {
      // Create SSH tunnel first
      await createSshTunnel();
      
      // Initialize Prisma client with custom DATABASE_URL for tunnel
      // Since we're using auto-assigned port, we'll use the default 5432 from env.example
      const tunnelDatabaseUrl = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB_NAME}`;
      
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: tunnelDatabaseUrl,
          },
        },
        log: ['query', 'info', 'warn', 'error'],
      });

      // Test the connection
      await prisma.$connect();
      console.log('✅ Successfully connected to database via SSH tunnel');
      
    } catch (error) {
      console.error('❌ Failed to initialize Prisma client:', error);
      throw error;
    }
  }

  return prisma;
}

/**
 * Disconnects the Prisma client and closes the SSH tunnel
 */
export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
  await closeSshTunnel();
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = await getPrismaClient();
    
    // Simple query to test connection
    await client.$queryRaw`SELECT 1 as test`;
    
    console.log('✅ Database connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
}); 