import { RateLimiter } from 'limiter';

export const limiter = {
  removeTokens: jest.fn(),
} as unknown as RateLimiter;
