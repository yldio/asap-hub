import { ContentfulFixture } from './contentful';
import { Fixture } from './types';

export * from './events';
export * from './user';
export * from './team';
export * from './interest-group';
export * from './working-group';
export * from './research-output';
export * from './types';

export const FixtureFactory = (): Fixture => {
  return new ContentfulFixture();
};
