import request from 'supertest';
import { app } from '../src/app';

describe('GET /api/health', () => {
  it('should return 200 and health status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('OK');
    expect(response.body.data).toHaveProperty('uptime');
    expect(response.body.data).toHaveProperty('timestamp');
  });
});
