import request from 'supertest';
import { app } from '../../app';
import { createTestUser } from '../utils';
import { AppDataSource } from '../../config/database';
import { generateToken } from '../../utils/jwt.util';

beforeAll(async () => {
  // Ensure we're using test database configuration
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  // Drop all tables and recreate schema
  await AppDataSource.synchronize(true);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    // Drop all tables before closing connection
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  }
});

beforeEach(async () => {
  // Drop all tables and recreate schema before each test
  await AppDataSource.synchronize(true);
});

afterEach(async () => {
  // Clean all tables after each test
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.clear();
  }
});

const userData = {
  email: 'test@example.com',
  password: 'password123'
};

describe('Auth Endpoints', () => {
  describe('POST /api/auth/signin', () => {
    it('should sign in a user with valid credentials', async () => {
      // Create a test user first
      
      await createTestUser(userData);

      // Attempt to sign in
      const response = await request(app)
        .post('/api/auth/signin')
        .send(userData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should not sign in with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('User not found');
    });

    it('should not sign in with invalid password', async () => {
      // Create a test user first
      await createTestUser(userData);

      // Attempt to sign in with wrong password
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('POST /api/auth/signout', () => {
    it('should successfully sign out an authenticated user', async () => {
      // Create a test user
      const user = await createTestUser(userData);
      
      // Generate a valid token
      const token = generateToken(user);

      const response = await request(app)
        .post('/api/auth/signout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Successfully signed out');
    });

    it('should not allow signout without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/signout')
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Authentication required');
    });

    it('should not allow signout with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/signout')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Invalid or expired token');
    });
  });
}); 