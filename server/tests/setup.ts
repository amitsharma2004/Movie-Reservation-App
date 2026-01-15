import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { jest, beforeAll, afterEach, afterAll } from '@jest/globals';

let mongoServer: MongoMemoryServer;

// Set JWT_SECRET for tests
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';

// Mock Redis before importing
jest.unstable_mockModule('../src/config/redis.js', () => ({
  RedisClient: {
    connect: jest.fn().mockResolvedValue(() => Promise.resolve()),
    on: jest.fn().mockReturnThis(),
    get: jest.fn(),
    set: jest.fn(),
  },
}));

// Setup before all tests
beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
});

// Cleanup after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
