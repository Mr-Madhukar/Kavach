import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

const app = express();
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

describe('API Health Check', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
