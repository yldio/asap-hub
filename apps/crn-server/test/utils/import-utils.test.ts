import {
  buildUserFields,
  cell,
  cleanOrcid,
  col,
  createAssetLink,
  createEntryLink,
  CREATE_USER_FIELDS_OPTIONS,
  extractBlueskyHandle,
  extractGitHubId,
  extractGoogleDriveFileId,
  extractGoogleScholarId,
  extractLinkedInId,
  extractResearcherId,
  extractResearchGateId,
  extractTwitterId,
  filterDegree,
  getErrorMessage,
  isArchivedResource,
  isEmptyRow,
  loc,
  mapTeamRole,
  normalizeTagNames,
  parseOpenQuestions,
  parseUserRow,
  REQUIRED_EXISTING_USER_COLUMNS,
  sanitizeSocialValue,
  sanitizeWebsiteUrl,
  shouldSkipRow,
  TAG_MAPPING,
  UPDATE_USER_FIELDS_OPTIONS,
  validateRequiredColumns,
  type ParsedUserData,
} from '../../scripts/import-utils';

const USER_HEADERS = [...REQUIRED_EXISTING_USER_COLUMNS];

const buildRow = (values: Record<string, string> = {}): string[] =>
  USER_HEADERS.map((header) => values[header] ?? '');

const getParsedUserData = (
  overrides: Partial<ParsedUserData> = {},
): ParsedUserData => ({
  firstName: 'Ada',
  nickname: '',
  lastName: 'Lovelace',
  email: 'ada@example.org',
  orcid: '',
  degree: undefined,
  rawLocation: '',
  city: '',
  stateOrProvince: '',
  country: '',
  jobTitle: '',
  institution: '',
  avatarSource: '',
  website1: '',
  website2: '',
  linkedIn: '',
  researcherId: '',
  twitter: '',
  blueSky: '',
  github: '',
  googleScholar: '',
  researchGate: '',
  responsibilities: '',
  researchInterests: '',
  expertiseAndResourceDescription: '',
  tagNames: [],
  questions: [],
  biography: '',
  role: undefined,
  teams: [],
  ...overrides,
});

describe('import-utils', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('isArchivedResource', () => {
    test('returns true when archivedVersion is present', () => {
      expect(isArchivedResource({ archivedVersion: 3 })).toBe(true);
    });

    test('returns true when archivedAt is present', () => {
      expect(
        isArchivedResource({ archivedAt: '2026-04-06T10:00:00.000Z' }),
      ).toBe(true);
    });

    test('returns false when neither archived marker is present', () => {
      expect(isArchivedResource({})).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    test('returns the message from an Error', () => {
      expect(getErrorMessage(new Error('Boom'))).toBe('Boom');
    });

    test('stringifies non-Error values', () => {
      expect(getErrorMessage(404)).toBe('404');
      expect(getErrorMessage({ foo: 'bar' })).toBe('[object Object]');
    });
  });

  describe('col and validateRequiredColumns', () => {
    test('returns the column index for an existing header', () => {
      expect(col(['A', 'B', 'C'], 'B')).toBe(1);
    });

    test('throws a clear error when the column is missing', () => {
      expect(() => col(['A', 'B'], 'C')).toThrow(
        'CSV column "C" not found. Available: A, B',
      );
    });

    test('does nothing when all required columns are present', () => {
      expect(() => validateRequiredColumns(['A', 'B'], ['A'])).not.toThrow();
    });

    test('throws when any required column is missing', () => {
      expect(() => validateRequiredColumns(['A', 'B'], ['A', 'C'])).toThrow(
        'CSV column "C" not found. Available: A, B',
      );
    });
  });

  describe('cell', () => {
    test('trims cell values', () => {
      expect(cell(['  value  '], 0)).toBe('value');
    });

    test('returns an empty string for a missing cell', () => {
      expect(cell([], 0)).toBe('');
    });
  });

  describe('shouldSkipRow', () => {
    test('skips rows with an empty ASAP Hub Role', () => {
      const row = buildRow({ 'First name': 'Ada' });

      expect(shouldSkipRow(row, USER_HEADERS)).toBe('empty ASAP Hub Role');
    });

    test('skips rows when a populated team has an UNKNOWN role', () => {
      const row = buildRow({
        'ASAP Hub Role': 'Grantee',
        'Team 3': 'Awatramani',
        'Team 3 Role': 'UNKNOWN',
      });

      expect(shouldSkipRow(row, USER_HEADERS)).toBe('Team 3 Role is UNKNOWN');
    });

    test('does not skip UNKNOWN team roles when the team name is blank', () => {
      const row = buildRow({
        'ASAP Hub Role': 'Grantee',
        'Team 1 Role': 'UNKNOWN',
      });

      expect(shouldSkipRow(row, USER_HEADERS)).toBeNull();
    });

    test('does not skip valid rows', () => {
      const row = buildRow({
        'ASAP Hub Role': 'Grantee',
        'Team 1': 'Fraser',
        'Team 1 Role': 'Data Manager',
      });

      expect(shouldSkipRow(row, USER_HEADERS)).toBeNull();
    });
  });

  describe('social extractors', () => {
    describe('extractLinkedInId', () => {
      test('extracts a LinkedIn profile slug from a profile URL', () => {
        expect(extractLinkedInId('https://www.linkedin.com/in/slug-123/')).toBe(
          'slug-123',
        );
      });

      test('returns a plain non-URL value after trimming a trailing slash', () => {
        expect(extractLinkedInId('plain-slug/')).toBe('plain-slug');
      });

      test('drops a non-LinkedIn URL', () => {
        expect(extractLinkedInId('https://example.org/user')).toBe('');
        expect(warnSpy).toHaveBeenCalledWith(
          '  Warning: Dropping non-LinkedIn URL from LinkedIn field: https://example.org/user',
        );
      });
    });

    describe('extractTwitterId', () => {
      test('extracts a handle from an @handle value', () => {
        expect(extractTwitterId('@parkinsons')).toBe('parkinsons');
      });

      test('extracts a handle from an X/Twitter URL', () => {
        expect(extractTwitterId('https://x.com/parkinsons')).toBe('parkinsons');
      });

      test('returns a plain non-URL handle as-is', () => {
        expect(extractTwitterId('parkinsons')).toBe('parkinsons');
      });

      test('drops a non-Twitter URL', () => {
        expect(extractTwitterId('https://example.org/parkinsons')).toBe('');
        expect(warnSpy).toHaveBeenCalledWith(
          '  Warning: Dropping non-Twitter/X URL from X field: https://example.org/parkinsons',
        );
      });
    });

    describe('extractGitHubId', () => {
      test('accepts a plain safe GitHub handle', () => {
        expect(extractGitHubId('safe-handle')).toBe('safe-handle');
      });

      test('extracts a handle from a GitHub profile URL', () => {
        expect(extractGitHubId('github.com/octocat')).toBe('octocat');
        expect(extractGitHubId('https://github.com/octocat')).toBe('octocat');
      });

      test('rejects non-profile GitHub paths', () => {
        expect(extractGitHubId('https://github.com/org/repo')).toBe('');
        expect(warnSpy).toHaveBeenCalledWith(
          '  Warning: Dropping non-GitHub profile from GitHub field: https://github.com/org/repo',
        );
      });

      test('rejects invalid plain handles', () => {
        expect(extractGitHubId('not_valid')).toBe('');
        expect(warnSpy).not.toHaveBeenCalled();
      });
    });

    describe('extractGoogleScholarId', () => {
      test('extracts the user query param from a Scholar URL', () => {
        expect(
          extractGoogleScholarId(
            'https://scholar.google.com/citations?user=ABC123&hl=en',
          ),
        ).toBe('ABC123');
      });

      test('returns a plain non-URL value unchanged', () => {
        expect(extractGoogleScholarId('ABC123')).toBe('ABC123');
      });

      test('drops a non-Scholar URL', () => {
        expect(extractGoogleScholarId('https://www.scopus.com/author')).toBe(
          '',
        );
        expect(warnSpy).toHaveBeenCalledWith(
          '  Warning: Dropping non-Scholar URL from Google Scholar field: https://www.scopus.com/author',
        );
      });
    });

    describe('extractResearchGateId', () => {
      test('extracts a profile slug from a ResearchGate profile URL', () => {
        expect(
          extractResearchGateId('https://www.researchgate.net/profile/Name-2'),
        ).toBe('Name-2');
      });

      test('extracts a slug from a scientific contributions URL', () => {
        expect(
          extractResearchGateId(
            'https://www.researchgate.net/scientific-contributions/Name-2',
          ),
        ).toBe('Name-2');
      });

      test('returns a plain non-URL value unchanged', () => {
        expect(extractResearchGateId('Name-2')).toBe('Name-2');
      });

      test('drops a non-ResearchGate URL', () => {
        expect(
          extractResearchGateId('https://example.org/research/Name-2'),
        ).toBe('');
        expect(warnSpy).toHaveBeenCalledWith(
          '  Warning: Dropping non-ResearchGate URL from ResearchGate field: https://example.org/research/Name-2',
        );
      });
    });

    describe('extractResearcherId', () => {
      test('extracts an ID from a Web of Science record URL', () => {
        expect(
          extractResearcherId(
            'https://www.webofscience.com/wos/author/record/A-7468-2013',
          ),
        ).toBe('A-7468-2013');
      });

      test('extracts an ID from a rid URL', () => {
        expect(
          extractResearcherId(
            'https://www.webofscience.com/wos/author/rid/A-1',
          ),
        ).toBe('A-1');
      });

      test('returns a plain non-URL value unchanged', () => {
        expect(extractResearcherId('A-7468-2013')).toBe('A-7468-2013');
      });

      test('drops a non-ResearcherID URL', () => {
        expect(extractResearcherId('https://example.org/author/A-1')).toBe('');
        expect(warnSpy).toHaveBeenCalledWith(
          '  Warning: Dropping non-ResearcherID URL from ResearcherID field: https://example.org/author/A-1',
        );
      });
    });

    describe('extractBlueskyHandle', () => {
      test('extracts a handle from an @handle value', () => {
        expect(extractBlueskyHandle('@name.bsky.social')).toBe(
          'name.bsky.social',
        );
      });

      test('extracts a handle from a Bluesky profile URL', () => {
        expect(
          extractBlueskyHandle('https://bsky.app/profile/name.bsky.social'),
        ).toBe('name.bsky.social');
      });

      test('returns a plain non-URL handle unchanged', () => {
        expect(extractBlueskyHandle('name.bsky.social')).toBe(
          'name.bsky.social',
        );
      });

      test('drops a non-Bluesky URL', () => {
        expect(extractBlueskyHandle('https://example.org/name')).toBe('');
        expect(warnSpy).toHaveBeenCalledWith(
          '  Warning: Dropping non-Bluesky URL from Bluesky field: https://example.org/name',
        );
      });
    });
  });

  describe('sanitizeSocialValue', () => {
    test('trims valid values', () => {
      expect(sanitizeSocialValue('  @handle  ')).toBe('@handle');
    });

    test('drops known junk values', () => {
      expect(sanitizeSocialValue('n/a')).toBe('');
      expect(sanitizeSocialValue('none')).toBe('');
      expect(sanitizeSocialValue('-')).toBe('');
    });

    test('drops values containing spaces', () => {
      expect(sanitizeSocialValue('No longer using X')).toBe('');
    });
  });

  describe('sanitizeWebsiteUrl', () => {
    test('keeps valid http/https URLs unchanged', () => {
      expect(
        sanitizeWebsiteUrl('https://example.org/profile', 'Website 1'),
      ).toBe('https://example.org/profile');
      expect(warnSpy).not.toHaveBeenCalled();
    });

    test('adds https:// to bare domains', () => {
      expect(sanitizeWebsiteUrl('fraserlab.com', 'Website 1')).toBe(
        'https://fraserlab.com',
      );
      expect(warnSpy).toHaveBeenCalledWith(
        '  Warning: Normalizing Website 1 by adding https://: fraserlab.com',
      );
    });

    test('drops placeholder values', () => {
      expect(sanitizeWebsiteUrl('n/a', 'Website 2')).toBe('');
      expect(warnSpy).toHaveBeenCalledWith(
        '  Warning: Dropping placeholder value from Website 2: n/a',
      );
    });

    test('drops URLs with unsupported schemes', () => {
      expect(sanitizeWebsiteUrl('ftp://example.org/file', 'Website 1')).toBe(
        '',
      );
      expect(warnSpy).toHaveBeenCalledWith(
        '  Warning: Dropping unsupported URL scheme from Website 1: ftp://example.org/file',
      );
    });

    test('drops invalid URLs', () => {
      expect(sanitizeWebsiteUrl('not-a-url', 'Website 1')).toBe('');
      expect(warnSpy).toHaveBeenCalledWith(
        '  Warning: Dropping invalid URL from Website 1: not-a-url',
      );
    });
  });

  describe('cleanOrcid', () => {
    test('returns an empty string for an empty ORCID', () => {
      expect(cleanOrcid('')).toBe('');
    });

    test('strips ORCID host prefixes, query strings, fragments, and trailing slashes', () => {
      expect(
        cleanOrcid(
          ' https://www.orcid.org/0000-0002-1825-0097/?foo=bar#fragment ',
        ),
      ).toBe('0000-0002-1825-0097');
    });

    test('keeps bare ORCID ids unchanged', () => {
      expect(cleanOrcid('0000-0002-1825-0097')).toBe('0000-0002-1825-0097');
    });
  });

  describe('filterDegree', () => {
    test('returns undefined for an empty value', () => {
      expect(filterDegree('')).toBeUndefined();
    });

    test('returns exact valid degree values unchanged', () => {
      expect(filterDegree('PhD')).toBe('PhD');
      expect(filterDegree('MD, PhD')).toBe('MD, PhD');
    });

    test('normalizes MD and PhD into the combined supported value', () => {
      expect(filterDegree('PhD, MD')).toBe('MD, PhD');
    });

    test('returns the first valid degree from a mixed list', () => {
      expect(filterDegree('PhD, BSc, MSc')).toBe('PhD');
    });

    test('drops unsupported degrees and warns', () => {
      expect(filterDegree('PhD, FRCPath')).toBe('PhD');
      expect(warnSpy).toHaveBeenCalledWith(
        '  Warning: Dropping invalid degree(s): FRCPath',
      );
    });

    test('returns undefined when no supported degrees remain', () => {
      expect(filterDegree('D.Phil.')).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledWith(
        '  Warning: Dropping invalid degree(s): D.Phil.',
      );
    });
  });

  describe('parseOpenQuestions', () => {
    test('keeps only non-empty questions in order', () => {
      expect(parseOpenQuestions('Question 1', '', 'Question 3', '')).toEqual([
        'Question 1',
        'Question 3',
      ]);
    });
  });

  describe('mapTeamRole', () => {
    test('maps known team role labels', () => {
      expect(mapTeamRole('Paid Collaborator')).toBe('Collaborating PI');
    });

    test('returns unknown team role labels unchanged and warns', () => {
      expect(mapTeamRole('Custom Role')).toBe('Custom Role');
      expect(warnSpy).toHaveBeenCalledWith(
        '  Warning: No role mapping for "Custom Role", using as-is',
      );
    });
  });

  describe('isEmptyRow', () => {
    test('returns true when every field is blank or whitespace', () => {
      expect(isEmptyRow(['', '  ', ''])).toBe(true);
    });

    test('returns false when any field has content', () => {
      expect(isEmptyRow(['', 'value', ''])).toBe(false);
    });
  });

  describe('parseUserRow', () => {
    test('parses and normalizes a fully prepared row', () => {
      const row = buildRow({
        'First name': ' Ada ',
        'Preferred name': ' Addie ',
        'Last name': ' Lovelace ',
        'Email address': 'ADA@EXAMPLE.ORG',
        ORCID: 'https://orcid.org/0000-0002-1825-0097/',
        Degree: 'PhD, MD',
        Location: 'Chicago|Illinois|USA',
        'Position title': ' Investigator ',
        Institution: ' ASU ',
        'Please upload a profile photo.': '/tmp/avatar.jpg',
        'Website 1': 'https://example.org',
        'Website 2': 'https://example.com',
        LinkedIn: 'https://www.linkedin.com/in/ada-lovelace/',
        ResearcherID:
          'https://www.webofscience.com/wos/author/record/A-7468-2013',
        X: '@ada',
        Bluesky: '@ada.bsky.social',
        GitHub: 'https://github.com/ada-lovelace',
        'Google Scholar':
          'https://scholar.google.com/citations?user=ABC123&hl=en',
        ResearchGate: 'https://www.researchgate.net/profile/Ada-Lovelace',
        Responsibilities: ' Leads science ',
        'Research Interests': ' Math ',
        'Expertise and resources description': ' Analysis ',
        Tags: 'Cryo-EM / Cryo-ET, GBA',
        'Open question 1': 'Question 1',
        'Open question 2': '',
        'Open question 3': 'Question 3',
        'Open question 4': '',
        Biography: ' Biography ',
        'ASAP Hub Role': 'Grantee',
        'Team 1': 'Fraser',
        'Team 1 Role': 'Project Manager',
        'Team 2': 'Ignored Team',
        'Team 2 Role': 'UNKNOWN',
        'Team 3': 'Gijsbers',
        'Team 3 Role': 'Data Manager',
      });

      expect(parseUserRow(row, USER_HEADERS)).toEqual({
        firstName: 'Ada',
        nickname: 'Addie',
        lastName: 'Lovelace',
        email: 'ada@example.org',
        orcid: '0000-0002-1825-0097',
        degree: 'MD, PhD',
        rawLocation: 'Chicago|Illinois|USA',
        city: 'Chicago',
        stateOrProvince: 'Illinois',
        country: 'USA',
        jobTitle: 'Investigator',
        institution: 'ASU',
        avatarSource: '/tmp/avatar.jpg',
        website1: 'https://example.org',
        website2: 'https://example.com',
        linkedIn: 'ada-lovelace',
        researcherId: 'A-7468-2013',
        twitter: 'ada',
        blueSky: 'ada.bsky.social',
        github: 'ada-lovelace',
        googleScholar: 'ABC123',
        researchGate: 'Ada-Lovelace',
        responsibilities: 'Leads science',
        researchInterests: 'Math',
        expertiseAndResourceDescription: 'Analysis',
        tagNames: ['Cryo-EM / Cryo-ET', 'GBA'],
        questions: ['Question 1', 'Question 3'],
        biography: 'Biography',
        role: 'Grantee',
        teams: [
          { name: 'Fraser', role: 'Project Manager' },
          { name: 'Gijsbers', role: 'Data Manager' },
        ],
      });
    });

    test('leaves city, state, and country blank when the location is not prepared', () => {
      const row = buildRow({
        'First name': 'Ada',
        'Last name': 'Lovelace',
        'Email address': 'ada@example.org',
        Location: 'Chicago, IL, USA',
      });

      expect(parseUserRow(row, USER_HEADERS)).toEqual(
        expect.objectContaining({
          rawLocation: 'Chicago, IL, USA',
          city: '',
          stateOrProvince: '',
          country: '',
          role: undefined,
          teams: [],
          tagNames: [],
          questions: [],
        }),
      );
    });

    test('throws when a prepared location does not have exactly three parts', () => {
      const row = buildRow({
        'First name': 'Ada',
        'Last name': 'Lovelace',
        'Email address': 'ada@example.org',
        Location: 'Chicago|Illinois',
      });

      expect(() => parseUserRow(row, USER_HEADERS)).toThrow(
        'Prepared location must use city|state|country format: Chicago|Illinois',
      );
    });
  });

  describe('loc and Contentful link helpers', () => {
    test('wraps values in the default locale', () => {
      expect(loc('value')).toEqual({ 'en-US': 'value' });
    });

    test('creates Contentful entry links', () => {
      expect(createEntryLink('entry-id')).toEqual({
        sys: { type: 'Link', linkType: 'Entry', id: 'entry-id' },
      });
    });

    test('creates Contentful asset links', () => {
      expect(createAssetLink('asset-id')).toEqual({
        sys: { type: 'Link', linkType: 'Asset', id: 'asset-id' },
      });
    });
  });

  describe('normalizeTagNames', () => {
    test('maps known tags, expands split tags, and preserves unknown tags', () => {
      expect(
        normalizeTagNames(['Copathology', 'Cryo-EM / Cryo-ET', 'Custom Tag']),
      ).toEqual(['Co-pathologies', 'Cryo-EM', 'Cryo-ET', 'Custom Tag']);
    });

    test('skips tags mapped to null and warns', () => {
      TAG_MAPPING['Needs Clarification'] = null;

      expect(normalizeTagNames(['Needs Clarification'])).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        '  Warning: Tag "Needs Clarification" is pending clarification and will be skipped',
      );

      delete TAG_MAPPING['Needs Clarification'];
    });
  });

  describe('extractGoogleDriveFileId', () => {
    test('extracts a file id from open URLs', () => {
      expect(
        extractGoogleDriveFileId(
          'https://drive.google.com/open?id=FILE123&usp=sharing',
        ),
      ).toBe('FILE123');
    });

    test('extracts a file id from /file/d/ URLs', () => {
      expect(
        extractGoogleDriveFileId(
          'https://drive.google.com/file/d/FILE456/view?usp=sharing',
        ),
      ).toBe('FILE456');
    });

    test('returns null for unsupported Drive URLs', () => {
      expect(
        extractGoogleDriveFileId(
          'https://drive.google.com/drive/folders/FILE789',
        ),
      ).toBeNull();
    });
  });

  describe('buildUserFields', () => {
    test('throws when role is required but missing', () => {
      const data = getParsedUserData({ role: undefined });

      expect(() =>
        buildUserFields(data, [], [], null, CREATE_USER_FIELDS_OPTIONS, []),
      ).toThrow('ASAP Hub Role is required for new users');
    });

    test('builds a complete creation payload with all populated fields', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-04-06T12:00:00.000Z'));

      const data = getParsedUserData({
        nickname: 'Addie',
        orcid: '0000-0002-1825-0097',
        degree: 'PhD',
        city: 'Chicago',
        stateOrProvince: 'Illinois',
        country: 'USA',
        jobTitle: 'Investigator',
        institution: 'ASU',
        website1: 'https://example.org',
        website2: 'https://example.com',
        linkedIn: 'ada-lovelace',
        researcherId: 'A-7468-2013',
        twitter: 'ada',
        github: 'ada-lovelace',
        googleScholar: 'ABC123',
        researchGate: 'Ada-Lovelace',
        blueSky: 'ada.bsky.social',
        responsibilities: 'Leads science',
        researchInterests: 'Math',
        expertiseAndResourceDescription: 'Analysis',
        biography: 'Biography',
        questions: ['Question 1', 'Question 2'],
        role: 'Grantee',
      });
      const existingTeams = [createEntryLink('existing-membership')];

      expect(
        buildUserFields(
          data,
          ['new-membership-1', 'new-membership-2'],
          ['tag-1', 'tag-2'],
          'avatar-1',
          CREATE_USER_FIELDS_OPTIONS,
          existingTeams,
        ),
      ).toEqual({
        firstName: { 'en-US': 'Ada' },
        lastName: { 'en-US': 'Lovelace' },
        email: { 'en-US': 'ada@example.org' },
        role: { 'en-US': 'Grantee' },
        lastUpdated: { 'en-US': '2026-04-06T12:00:00.000Z' },
        nickname: { 'en-US': 'Addie' },
        orcid: { 'en-US': '0000-0002-1825-0097' },
        degree: { 'en-US': 'PhD' },
        city: { 'en-US': 'Chicago' },
        stateOrProvince: { 'en-US': 'Illinois' },
        country: { 'en-US': 'USA' },
        jobTitle: { 'en-US': 'Investigator' },
        institution: { 'en-US': 'ASU' },
        website1: { 'en-US': 'https://example.org' },
        website2: { 'en-US': 'https://example.com' },
        linkedIn: { 'en-US': 'ada-lovelace' },
        researcherId: { 'en-US': 'A-7468-2013' },
        twitter: { 'en-US': 'ada' },
        github: { 'en-US': 'ada-lovelace' },
        googleScholar: { 'en-US': 'ABC123' },
        researchGate: { 'en-US': 'Ada-Lovelace' },
        blueSky: { 'en-US': 'ada.bsky.social' },
        responsibilities: { 'en-US': 'Leads science' },
        researchInterests: { 'en-US': 'Math' },
        expertiseAndResourceDescription: { 'en-US': 'Analysis' },
        biography: { 'en-US': 'Biography' },
        questions: { 'en-US': ['Question 1', 'Question 2'] },
        researchTags: {
          'en-US': [createEntryLink('tag-1'), createEntryLink('tag-2')],
        },
        avatar: { 'en-US': createAssetLink('avatar-1') },
        teams: {
          'en-US': [
            createEntryLink('existing-membership'),
            createEntryLink('new-membership-1'),
            createEntryLink('new-membership-2'),
          ],
        },
      });
    });

    test('omits email and optional empty fields for update payloads', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-04-06T12:00:00.000Z'));

      const data = getParsedUserData();

      expect(
        buildUserFields(data, [], [], null, UPDATE_USER_FIELDS_OPTIONS, []),
      ).toEqual({
        firstName: { 'en-US': 'Ada' },
        lastName: { 'en-US': 'Lovelace' },
        lastUpdated: { 'en-US': '2026-04-06T12:00:00.000Z' },
        teams: { 'en-US': [] },
      });
    });
  });
});
