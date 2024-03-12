import { select } from './knobs';

export const timezone = (name: string) =>
  select(
    name,
    [
      'America/Los_Angeles',
      'America/New_York',
      'Europe/London',
      'Europe/Berlin',
      'Europe/Tallinn',
    ],
    'Europe/London',
  );
