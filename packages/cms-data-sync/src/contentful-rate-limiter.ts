import { RateLimiter } from 'limiter';

export const contentfulRateLimiter = new RateLimiter({
  tokensPerInterval: 5,
  interval: 'second',
});
