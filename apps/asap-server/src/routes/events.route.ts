import { Router } from 'express';

export const eventRoutes = Router();

eventRoutes.get('/events', async (req, res) => {
  res.json({ response: 'OK' });
});
