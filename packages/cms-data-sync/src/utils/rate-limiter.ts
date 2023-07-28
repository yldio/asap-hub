import { RateLimiter } from 'limiter';

export const rateLimiter = new RateLimiter({
  tokensPerInterval: 3,
  interval: 'second',
});
