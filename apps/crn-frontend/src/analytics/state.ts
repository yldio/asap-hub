import { getMemberships } from './api';

export const useMemberships = () => ({
  data: getMemberships(),
});
