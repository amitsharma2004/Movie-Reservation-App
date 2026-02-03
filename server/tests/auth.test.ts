import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { faker } from '@faker-js/faker';
import { User } from '../src/modules/auth/auth.model.js';
import { register, login, logout } from '../src/modules/auth/auth.controller.js';
import globalErrorHandler from '../src/middlewares/globalErrorHandler.js';
import cookieParser from 'cookie-parser';

// Create test app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);
app.use(globalErrorHandler);

describe('Auth Controller Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        fullname: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'Password123!',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        phone: '1234567890',
        zipCode: '12345',
        country: faker.location.country(),
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.user).toHaveProperty('email', userData.email.toLowerCase());
      expect(response.body.data.user).toHaveProperty('fullname', userData.fullname);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should fail to register with duplicate email', async () => {
      const userData = {
        fullname: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'Password123!',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        phone: '1234567890',
        zipCode: '12345',
        country: faker.location.country(),
      };

      await request(app).post('/api/auth/register').send(userData).expect(201);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should fail with invalid email format', async () => {
      const userData = {
        fullname: faker.person.fullName(),
        email: 'invalid-email',
        password: 'Password123!',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        phone: '1234567890',
        zipCode: '12345',
        country: faker.location.country(),
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing required fields', async () => {
      const userData = {
        email: faker.internet.email(),
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with short password', async () => {
      const userData = {
        fullname: faker.person.fullName(),
        email: faker.internet.email(),
        password: '123',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        phone: '1234567890',
        zipCode: '12345',
        country: faker.location.country(),
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      fullname: 'Test User',
      email: 'testlogin@example.com',
      password: 'Password123!',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      phone: '1234567890',
      zipCode: '12345',
      country: 'Test Country',
    };

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('tokens');
      expect(response.body.data.tokens).toHaveProperty('accessToken');
      expect(response.body.data.tokens).toHaveProperty('refreshToken');
    });

    it('should fail login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should fail login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should fail login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
    });
  });

  describe('User Model Tests', () => {
    it('should hash password before saving', async () => {
      const userData = {
        fullname: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'PlainPassword123!',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        phone: '1234567890',
        zipCode: '12345',
        country: faker.location.country(),
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe('PlainPassword123!');
      expect(user.password.length).toBeGreaterThan(20);
    });

    it('should compare passwords correctly', async () => {
      const plainPassword = 'TestPassword123!';
      const userData = {
        fullname: faker.person.fullName(),
        email: faker.internet.email(),
        password: plainPassword,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        phone: '1234567890',
        zipCode: '12345',
        country: faker.location.country(),
      };

      const user = new User(userData);
      await user.save();

      expect(user.comparePassword(plainPassword)).toBe(true);
      expect(user.comparePassword('WrongPassword')).toBe(false);
    });

    it('should generate valid JWT tokens', async () => {
      const userData = {
        fullname: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'Password123!',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        phone: '1234567890',
        zipCode: '12345',
        country: faker.location.country(),
      };

      const user = new User(userData);
      await user.save();

      const { accessToken, refreshToken } = user.generateToken();

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(typeof accessToken).toBe('string');
      expect(typeof refreshToken).toBe('string');
    });

    it('should not include password in JSON response', async () => {
      const userData = {
        fullname: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'Password123!',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        phone: '1234567890',
        zipCode: '12345',
        country: faker.location.country(),
      };

      const user = new User(userData);
      await user.save();

      const userJSON = user.toJSON();
      expect(userJSON).not.toHaveProperty('password');
      expect(userJSON).toHaveProperty('email');
      expect(userJSON).toHaveProperty('fullname');
    });
  });
});
