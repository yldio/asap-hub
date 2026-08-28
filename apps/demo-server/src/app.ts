import express, { Express, NextFunction, Request, Response } from 'express';
import { claimsMiddleware, userMiddleware } from './auth';
import { isLocal } from './config';
import { asyncHandler } from './routes/async-router';
import { foldersRouter } from './routes/folders';
import { currentUser } from './routes/request';
import { invitesRouter } from './routes/invites';
import { mediaRouter } from './routes/media';
import { captureRouter } from './routes/capture';
import { projectsRouter } from './routes/projects';
import { recordingsRouter } from './routes/recordings';
import { uploadsRouter } from './routes/uploads';
import { usersRouter } from './routes/users';
import { videosRouter } from './routes/videos';

export const appFactory = (): Express => {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // the capture snippet runs on someone else's site and carries a session token
  // rather than a user, so it is mounted ahead of the auth middleware
  app.use('/api/capture', captureRouter());

  if (isLocal()) {
    app.use('/media', mediaRouter());
  }

  const api = express.Router();
  // per-user payloads and Set-Cookie must never be stored by CloudFront or a
  // shared proxy, whatever the distribution TTLs happen to be
  api.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, private');
    next();
  });
  api.use(asyncHandler(claimsMiddleware));
  api.use(asyncHandler(userMiddleware));

  api.get('/me', (req, res) => {
    const { sub, name, email, role } = currentUser(req);
    res.json({ sub, name, email, role });
  });

  api.use('/folders', foldersRouter());
  api.use('/projects', projectsRouter());
  api.use('/projects', recordingsRouter());
  api.use('/videos', videosRouter());
  api.use('/uploads', uploadsRouter());
  api.use('/invites', invitesRouter());
  api.use('/users', usersRouter());

  app.use('/api', api);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({ error: 'internal' });
  });

  return app;
};
