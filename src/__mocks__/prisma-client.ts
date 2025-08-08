// Mock Prisma Client for testing
export const PrismaClient = jest.fn().mockImplementation(() => ({
  tclients: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  tclients_auth: {
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  tproviders: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  tservices: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  tcategories: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  tcontacts: {
    create: jest.fn(),
    update: jest.fn(),
  },
  tlocations: {
    create: jest.fn(),
    update: jest.fn(),
  },
  tphotos: {
    create: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(),
}))

// Mock the prisma instance
export const prisma = new PrismaClient()

// Export default for compatibility
export default {
  PrismaClient,
  prisma,
}
