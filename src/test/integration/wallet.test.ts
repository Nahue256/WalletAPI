import request from 'supertest';
import { app } from '../../app';
import { createTestUser, createTestWallet } from '../utils';
import { generateToken } from '../../utils/jwt.util';

describe('Wallet Endpoints', () => {
  const userData = {
    email: 'test@example.com',
    password: 'password123'
  };

  const walletData = {
    chain: 'ethereum',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    tag: 'Main Wallet'
  };

  describe('POST /api/wallets', () => {
    it('should create a new wallet for authenticated user', async () => {
      // Create a test user and get token
      const user = await createTestUser(userData);
      const token = generateToken(user);

      const response = await request(app)
        .post('/api/wallets')
        .set('Authorization', `Bearer ${token}`)
        .send(walletData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.wallet).toHaveProperty('id');
      expect(response.body.data.wallet.chain).toBe(walletData.chain);
      expect(response.body.data.wallet.address).toBe(walletData.address);
      expect(response.body.data.wallet.tag).toBe(walletData.tag);
      expect(response.body.data.wallet.userId).toBe(user.id);
    });

    it('should not create a wallet without authentication', async () => {
      const response = await request(app)
        .post('/api/wallets')
        .send(walletData)
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Authentication required');
    });

    it('should not create a wallet with duplicate address', async () => {
      const user = await createTestUser();
      const token = generateToken(user);

      // Create first wallet
      await request(app)
        .post('/api/wallets')
        .set('Authorization', `Bearer ${token}`)
        .send(walletData);

      // Try to create second wallet with same address
      const response = await request(app)
        .post('/api/wallets')
        .set('Authorization', `Bearer ${token}`)
        .send(walletData)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Wallet with this address already exists');
    });
  });

  describe('GET /api/wallets', () => {
    it('should return all wallets for authenticated user', async () => {
      const user = await createTestUser();
      const token = generateToken(user);

      // Create test wallets
      await createTestWallet(user.id, { chain: 'ethereum', address: '0x111' });
      await createTestWallet(user.id, { chain: 'bitcoin', address: '1A1zP1' });

      const response = await request(app)
        .get('/api/wallets')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data.wallets)).toBe(true);
      expect(response.body.data.wallets.length).toBe(2);
      expect(response.body.data.wallets[0].userId).toBe(user.id);
    });

    it('should not return wallets without authentication', async () => {
      const response = await request(app)
        .get('/api/wallets')
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Authentication required');
    });
  });

  describe('GET /api/wallets/:id', () => {
    it('should return a specific wallet by id', async () => {
      const user = await createTestUser();
      const token = generateToken(user);
      const wallet = await createTestWallet(user.id, walletData);

      const response = await request(app)
        .get(`/api/wallets/${wallet.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.wallet.id).toBe(wallet.id);
      expect(response.body.data.wallet.chain).toBe(walletData.chain);
      expect(response.body.data.wallet.address).toBe(walletData.address);
    });

    it('should not return wallet of another user', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });
      const token2 = generateToken(user2);
      
      // Create wallet for user1
      const wallet = await createTestWallet(user1.id, walletData);

      // Try to access with user2's token
      const response = await request(app)
        .get(`/api/wallets/${wallet.id}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(403);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Unauthorized access to wallet');
    });
  });

  describe('PUT /api/wallets/:id', () => {
    it('should update a wallet', async () => {
      const user = await createTestUser();
      const token = generateToken(user);
      const wallet = await createTestWallet(user.id);

      const updateData = {
        tag: 'Updated Wallet',
        chain: 'bitcoin'
      };

      const response = await request(app)
        .put(`/api/wallets/${wallet.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.wallet.tag).toBe(updateData.tag);
      expect(response.body.data.wallet.chain).toBe(updateData.chain);
    });

    it('should not update wallet of another user', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });
      const token2 = generateToken(user2);
      
      const wallet = await createTestWallet(user1.id);

      const response = await request(app)
        .put(`/api/wallets/${wallet.id}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ tag: 'Hacked Wallet' })
        .expect(403);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Unauthorized access to wallet');
    });
  });

  describe('DELETE /api/wallets/:id', () => {
    it('should delete a wallet', async () => {
      const user = await createTestUser();
      const token = generateToken(user);
      const wallet = await createTestWallet(user.id);

      const response = await request(app)
        .delete(`/api/wallets/${wallet.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Wallet successfully deleted');

      // Verify wallet is deleted
      const getResponse = await request(app)
        .get(`/api/wallets/${wallet.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(getResponse.body.status).toBe('error');
      expect(getResponse.body.message).toBe('Wallet not found');
    });

    it('should not delete wallet of another user', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });
      const token2 = generateToken(user2);
      
      const wallet = await createTestWallet(user1.id);

      const response = await request(app)
        .delete(`/api/wallets/${wallet.id}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(403);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Unauthorized access to wallet');
    });
  });
}); 