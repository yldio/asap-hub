import { RateLimiter } from 'limiter';

export const rateLimiter = new RateLimiter({
  tokensPerInterval: 5,
  interval: 'second',
});
