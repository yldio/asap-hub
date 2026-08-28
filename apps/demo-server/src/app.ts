import express, { Express, NextFunction, Request, Response } from 'express';
import { claimsMiddleware, userMiddleware } from './auth';
import { isLocal } from './config';
import { foldersRouter } from './routes/folders';
import { currentUser } from './routes/request';
import { invitesRouter } from './routes/invites';
import { mediaRouter } from './routes/media';
import { projectsRouter } from './routes/projects';
import { uploadsRouter } from './routes/uploads';
import { usersRouter } from './routes/users';
import { videosRouter } from './routes/videos';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const asyncHandler =
  (handler: AsyncHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };

export const appFactory = (): Express => {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

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
