import { ContentfulFixture } from './contentful';
import { SquidexFixture } from './squidex';
import { Fixture } from './types';

export * from './events';
export * from './user';
export * from './team';
export * from './interest-group';
export * from './research-output';
export * from './types';

export const FixtureFactory = (cms: string | undefined): Fixture => {
  if (cms === 'contentful') {
    return new ContentfulFixture();
  }
  if (cms === 'squidex') {
    return new SquidexFixture();
  }
  throw new Error(`Unrecognised CMS: ${cms}`);
};
