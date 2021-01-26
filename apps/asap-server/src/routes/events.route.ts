import { Router } from 'express';

export const eventRouteFactory = (): Router => {
  const eventRoutes = Router();

  eventRoutes.get('/events', async (req, res) => {
    res.json({ response: 'OK' });
  });

  eventRoutes.post('/events', async (req, res) => {
    res.status(201).json({ response: 'OK' });
  });

  return eventRoutes;
};
