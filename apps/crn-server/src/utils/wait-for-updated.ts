import { Sys } from '@asap-hub/contentful';
import retry from 'async-retry';

type Entity = 'events' | 'users';
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

type Data = {
  [K in Entity]?: {
    sys: OptionalExceptFor<Sys, 'publishedVersion'>;
  } | null;
};

export const waitForUpdated = async <FetchType extends Data>(
  version: number,
  fetchData: () => Promise<FetchType>,
  entity: Entity,
) =>
  retry(
    // eslint-disable-next-line consistent-return
    async (bail) => {
      const data = await fetchData();

      if (!data[entity]) {
        return bail(new Error('Not found'));
      }
      if ((data[entity]?.sys.publishedVersion || 0) < version) {
        throw new Error('Not synced');
      }
    },
    { minTimeout: 100 },
  );
