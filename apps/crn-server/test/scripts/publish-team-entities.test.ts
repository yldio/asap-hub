import { type Asset, type Entry } from '@asap-hub/contentful';
import {
  buildAssetUrl,
  buildEntryUrl,
  buildResolvedTeam,
  createQueue,
  describeAsset,
  describeEntry,
  getContentfulAppBaseUrl,
  getLinkedEntryIds,
  getLocalizedFieldValue,
  getLocalizedString,
  getPublishState,
  isNotFoundError,
  isTeamEntry,
} from '../../scripts/publish-team-entities';

const originalContentfulEnv = {
  CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID,
};

const createEntry = ({
  id = 'entry-id',
  contentTypeId = 'teams',
  fields = {},
}: {
  id?: string;
  contentTypeId?: string;
  fields?: Record<string, unknown>;
} = {}): Entry =>
  ({
    sys: {
      id,
      contentType: {
        sys: {
          id: contentTypeId,
        },
      },
    },
    fields: Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, { 'en-US': value }]),
    ),
  }) as unknown as Entry;

const createAsset = ({
  id = 'asset-id',
  fields = {},
}: {
  id?: string;
  fields?: Record<string, unknown>;
} = {}): Asset =>
  ({
    sys: {
      id,
    },
    fields: Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, { 'en-US': value }]),
    ),
  }) as unknown as Asset;

describe('publish-team-entities helpers', () => {
  afterEach(() => {
    if (originalContentfulEnv.CONTENTFUL_SPACE_ID === undefined) {
      delete process.env.CONTENTFUL_SPACE_ID;
    } else {
      process.env.CONTENTFUL_SPACE_ID =
        originalContentfulEnv.CONTENTFUL_SPACE_ID;
    }

    if (originalContentfulEnv.CONTENTFUL_ENV_ID === undefined) {
      delete process.env.CONTENTFUL_ENV_ID;
    } else {
      process.env.CONTENTFUL_ENV_ID = originalContentfulEnv.CONTENTFUL_ENV_ID;
    }
  });

  describe('createQueue', () => {
    test('creates an empty queue with all expected sets', () => {
      expect(createQueue()).toEqual({
        researchTags: new Set(),
        assets: new Set(),
        researchOutputVersions: new Set(),
        teams: new Set(),
        teamMemberships: new Set(),
        projectMemberships: new Set(),
        users: new Set(),
        projects: new Set(),
        researchOutputs: new Set(),
      });
    });

    test('returns fresh sets for each call', () => {
      const firstQueue = createQueue();
      firstQueue.users.add('user-1');

      const secondQueue = createQueue();

      expect(secondQueue.users.size).toBe(0);
      expect(secondQueue.users).not.toBe(firstQueue.users);
    });
  });

  describe('getPublishState', () => {
    test('returns draft when there is no publishedVersion', () => {
      expect(getPublishState({ id: '1', version: 3 })).toBe('draft');
    });

    test('returns changed when version is more than one ahead of publishedVersion', () => {
      expect(
        getPublishState({ id: '1', version: 7, publishedVersion: 5 }),
      ).toBe('changed');
    });

    test('returns published when version is exactly one ahead of publishedVersion', () => {
      expect(
        getPublishState({ id: '1', version: 6, publishedVersion: 5 }),
      ).toBe('published');
    });

    test('returns published when publishedVersion exists but version is missing', () => {
      expect(getPublishState({ id: '1', publishedVersion: 5 })).toBe(
        'published',
      );
    });
  });

  describe('Contentful app URL helpers', () => {
    test('throws when Contentful env vars are missing', () => {
      delete process.env.CONTENTFUL_SPACE_ID;
      delete process.env.CONTENTFUL_ENV_ID;

      expect(() => getContentfulAppBaseUrl()).toThrow(
        'Missing env var: CONTENTFUL_SPACE_ID',
      );
    });

    test('throws when the Contentful environment ID is missing', () => {
      process.env.CONTENTFUL_SPACE_ID = 'space-1';
      delete process.env.CONTENTFUL_ENV_ID;

      expect(() => getContentfulAppBaseUrl()).toThrow(
        'Missing env var: CONTENTFUL_ENV_ID',
      );
    });

    test('returns the Contentful app base URL when env vars are present', () => {
      process.env.CONTENTFUL_SPACE_ID = 'space-1';
      process.env.CONTENTFUL_ENV_ID = 'env-1';

      expect(getContentfulAppBaseUrl()).toBe(
        'https://app.contentful.com/spaces/space-1/environments/env-1',
      );
    });

    test('builds entry and asset URLs from the base URL', () => {
      const appBaseUrl =
        'https://app.contentful.com/spaces/space-1/environments/env-1';

      expect(buildEntryUrl(appBaseUrl, 'entry-1')).toBe(
        'https://app.contentful.com/spaces/space-1/environments/env-1/entries/entry-1',
      );
      expect(buildAssetUrl(appBaseUrl, 'asset-1')).toBe(
        'https://app.contentful.com/spaces/space-1/environments/env-1/assets/asset-1',
      );
    });
  });

  describe('localized field helpers', () => {
    test('returns the localized field value when present', () => {
      const entry = createEntry({ fields: { displayName: 'Fraser' } });

      expect(getLocalizedFieldValue(entry, 'displayName')).toBe('Fraser');
    });

    test('returns undefined for a missing localized field value', () => {
      const entry = createEntry();

      expect(getLocalizedFieldValue(entry, 'displayName')).toBeUndefined();
    });

    test('returns a non-empty localized string only for non-empty strings', () => {
      const entry = createEntry({
        fields: { title: 'Project title', emptyField: '', numericField: 123 },
      });

      expect(getLocalizedString(entry, 'title')).toBe('Project title');
      expect(getLocalizedString(entry, 'emptyField')).toBeUndefined();
      expect(getLocalizedString(entry, 'numericField')).toBeUndefined();
    });
  });

  describe('getLinkedEntryIds', () => {
    test('returns a single linked entry ID', () => {
      expect(getLinkedEntryIds({ sys: { id: 'entry-1' } })).toEqual([
        'entry-1',
      ]);
    });

    test('flattens nested arrays of linked entry values', () => {
      expect(
        getLinkedEntryIds([
          { sys: { id: 'entry-1' } },
          [{ sys: { id: 'entry-2' } }, { foo: 'bar' }],
          null,
          { sys: { id: 3 } },
        ]),
      ).toEqual(['entry-1', 'entry-2']);
    });

    test('returns an empty array for junk values', () => {
      expect(getLinkedEntryIds(undefined)).toEqual([]);
      expect(getLinkedEntryIds({ foo: 'bar' })).toEqual([]);
    });
  });

  describe('describeEntry', () => {
    test('describes teams by display name with a fallback', () => {
      expect(
        describeEntry(
          createEntry({ fields: { displayName: 'Fraser' } }),
          'team',
        ),
      ).toBe('Fraser');
      expect(describeEntry(createEntry(), 'team')).toBe('Unnamed team');
    });

    test('describes users by full name, then email, then unnamed fallback', () => {
      expect(
        describeEntry(
          createEntry({ fields: { firstName: 'Ada', lastName: 'Lovelace' } }),
          'user',
        ),
      ).toBe('Ada Lovelace');
      expect(
        describeEntry(
          createEntry({ fields: { email: 'ada@example.org' } }),
          'user',
        ),
      ).toBe('ada@example.org');
      expect(describeEntry(createEntry(), 'user')).toBe('Unnamed user');
    });

    test('describes projects by projectId, then title, then unnamed fallback', () => {
      expect(
        describeEntry(
          createEntry({ fields: { projectId: 'ASAP-1' } }),
          'project',
        ),
      ).toBe('ASAP-1');
      expect(
        describeEntry(
          createEntry({ fields: { title: 'Project Title' } }),
          'project',
        ),
      ).toBe('Project Title');
      expect(describeEntry(createEntry(), 'project')).toBe('Unnamed project');
    });

    test('describes label-specific content types with their fallback chains', () => {
      expect(
        describeEntry(
          createEntry({ fields: { name: 'Tag Name' } }),
          'researchTag',
        ),
      ).toBe('Tag Name');
      expect(describeEntry(createEntry(), 'researchTag')).toBe(
        'Unnamed research tag',
      );

      expect(
        describeEntry(
          createEntry({ fields: { title: 'Output Title' } }),
          'researchOutput',
        ),
      ).toBe('Output Title');
      expect(describeEntry(createEntry(), 'researchOutput')).toBe(
        'Unnamed research output',
      );

      expect(
        describeEntry(
          createEntry({ fields: { title: 'Version Title' } }),
          'researchOutputVersion',
        ),
      ).toBe('Version Title');
      expect(describeEntry(createEntry(), 'researchOutputVersion')).toBe(
        'Unnamed research output version',
      );

      expect(
        describeEntry(
          createEntry({ fields: { role: 'Lead PI' } }),
          'teamMembership',
        ),
      ).toBe('Lead PI');
      expect(describeEntry(createEntry(), 'teamMembership')).toBe(
        'Unnamed team membership',
      );

      expect(
        describeEntry(
          createEntry({ fields: { role: 'Member' } }),
          'projectMembership',
        ),
      ).toBe('Member');
      expect(describeEntry(createEntry(), 'projectMembership')).toBe(
        'Unnamed project membership',
      );
    });

    test('returns the label for unknown entry types', () => {
      expect(describeEntry(createEntry(), 'mystery')).toBe('mystery');
    });
  });

  describe('describeAsset', () => {
    test('describes assets by title first', () => {
      expect(describeAsset(createAsset({ fields: { title: 'Avatar' } }))).toBe(
        'Avatar',
      );
    });

    test('falls back to the file name when title is missing', () => {
      expect(
        describeAsset(
          createAsset({ fields: { file: { fileName: 'avatar.png' } } }),
        ),
      ).toBe('avatar.png');
    });

    test('falls back to an unnamed asset label', () => {
      expect(describeAsset(createAsset())).toBe('Unnamed asset');
    });
  });

  describe('isNotFoundError', () => {
    test('returns false for non-Error values', () => {
      expect(isNotFoundError('404')).toBe(false);
    });

    test('detects a JSON encoded 404 error', () => {
      expect(isNotFoundError(new Error('{"status":404}'))).toBe(true);
    });

    test('does not treat other JSON status codes as 404s', () => {
      expect(isNotFoundError(new Error('{"status":500}'))).toBe(false);
    });

    test('detects plain-text 404 and not found errors', () => {
      expect(
        isNotFoundError(new Error('Request failed with status code 404')),
      ).toBe(true);
      expect(isNotFoundError(new Error('Resource not found'))).toBe(true);
    });

    test('returns false for unrelated errors', () => {
      expect(isNotFoundError(new Error('Boom'))).toBe(false);
    });
  });

  describe('isTeamEntry', () => {
    test('returns true for team entries', () => {
      expect(isTeamEntry(createEntry({ contentTypeId: 'teams' }))).toBe(true);
    });

    test('returns false for non-team entries', () => {
      expect(isTeamEntry(createEntry({ contentTypeId: 'users' }))).toBe(false);
    });
  });

  describe('buildResolvedTeam', () => {
    test('builds a resolved team using the display name when present', () => {
      expect(
        buildResolvedTeam(
          createEntry({ id: 'team-1', fields: { displayName: 'Fraser' } }),
          'Fraser',
          'https://app.contentful.com/spaces/space-1/environments/env-1',
        ),
      ).toEqual({
        id: 'team-1',
        name: 'Fraser',
        reference: 'Fraser',
        url: 'https://app.contentful.com/spaces/space-1/environments/env-1/entries/team-1',
      });
    });

    test('falls back to the entry id when the display name is missing', () => {
      expect(
        buildResolvedTeam(
          createEntry({ id: 'team-1' }),
          'team-1',
          'https://app.contentful.com/spaces/space-1/environments/env-1',
        ),
      ).toEqual({
        id: 'team-1',
        name: 'team-1',
        reference: 'team-1',
        url: 'https://app.contentful.com/spaces/space-1/environments/env-1/entries/team-1',
      });
    });
  });
});
