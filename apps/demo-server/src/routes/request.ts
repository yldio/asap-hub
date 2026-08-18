import { Request } from 'express';
import { AuthenticatedUser } from '../auth';

const anonymous: AuthenticatedUser = {
  sub: '',
  email: '',
  name: '',
  role: 'member',
  status: 'active',
};

// the auth middleware always populates req.user before any router runs
export const currentUser = (req: Request): AuthenticatedUser =>
  req.user ?? anonymous;

export const pathParam = (req: Request, name: string): string =>
  req.params[name] ?? '';
