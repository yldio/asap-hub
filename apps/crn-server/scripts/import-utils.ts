import {
  type Entry,
  getLinkAsset,
  getLinkEntity,
  getRestClient,
  type Environment,
  type Link,
} from '@asap-hub/contentful';
import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

/** Parsed representation of a user row from the import CSV. */
export type ParsedUserData = {
  firstName: string;
  nickname: string;
  lastName: string;
  email: string;
  orcid: string;
  degree: string | undefined;
  rawLocation: string;
  city: string;
  stateOrProvince: string;
  country: string;
  jobTitle: string;
  institution: string;
  avatarSource: string;
  website1: string;
  website2: string;
  linkedIn: string;
  researcherId: string;
  twitter: string;
  blueSky: string;
  github: string;
  googleScholar: string;
  researchGate: string;
  responsibilities: string;
  researchInterests: string;
  expertiseAndResourceDescription: string;
  tagNames: string[];
  questions: string[];
  biography: string;
  /** Value from the CSV `ASAP Hub Role` column. */
  role: string | undefined;
  teams: Array<{ name: string; role: string }>;
};

/** Parsed CLI flags shared by the import scripts. */
export type ImportArgs = {
  csvPath: string;
  prepareAvatars: boolean;
  prepareLocations: boolean;
  prepareTags: boolean;
  hasPrepareFlag: boolean;
};

export type ContentfulEntryLookup = {
  id: string;
  entry: Entry;
};

export type LocalizedField<T> = {
  'en-US': T;
};

export type LocalizedFields = Record<string, LocalizedField<unknown>>;

type ArchivableSys = {
  archivedAt?: string;
  archivedVersion?: number;
};

/**
 * Controls how `buildUserFields()` applies user data for a specific import flow.
 *
 * Use `CREATE_USER_FIELDS_OPTIONS` when building fields for brand-new users and
 * `UPDATE_USER_FIELDS_OPTIONS` when updating existing users.
 */
export type BuildUserFieldsOptions = {
  /** Include the email field in the generated payload. */
  includeEmail: boolean;
  /** Require the CSV `ASAP Hub Role` value to be present before building the payload. */
  requireRole: boolean;
};

/** Use these options when creating a brand-new user entry. */
export const CREATE_USER_FIELDS_OPTIONS: BuildUserFieldsOptions = {
  includeEmail: true,
  requireRole: true,
};

/** Use these options when updating an existing user entry. */
export const UPDATE_USER_FIELDS_OPTIONS: BuildUserFieldsOptions = {
  includeEmail: false,
  requireRole: false,
};

/** Accepted degree values for the CRN user content model. */
export const VALID_DEGREES = [
  'BA',
  'BSc',
  'MSc',
  'PhD',
  'MD',
  'MD, PhD',
  'MPH',
  'MA',
  'MBA',
];

/** Maps CSV team role labels to the team membership roles used in Contentful. */
export const TEAM_ROLE_MAPPING: Record<string, string> = {
  'Coordinating Lead PI': 'Lead PI (Core Leadership)',
  'Core Leadership - Co-Investigator': 'Co-PI (Core Leadership)',
  'Paid Collaborator': 'Collaborating PI',
  'Unpaid Collaborator': 'Collaborating PI',
  'Project Manager': 'Project Manager',
  'Data Manager': 'Data Manager',
};

/**
 * Maps CSV tag labels to the CMS research tag names used in Contentful.
 * Array values expand a single CSV tag into multiple CMS tags.
 */
export const TAG_MAPPING: Record<string, string | string[] | null> = {
  Copathology: 'Co-pathologies',
  'Cryo-EM / Cryo-ET': ['Cryo-EM', 'Cryo-ET'],
  'Immunohistochemistry (IHC)': 'Immunohistochemistry',
  'Induced pluripotent stem cells (iPSC)':
    'iPSCs (Induced pluripotent stem cells)',
  'Gut-brain axis': 'Gut-brain axis',
  'Neural circuits': 'neuronal circuits',
  'Next generation sequencing (NGS)': 'Next generation sequencing',
  'Optogenetics / chemogenetics': ['Optogenetics', 'Chemogenetics'],
  'Artificial intelligence / Machine learning': [
    'Artificial intelligence',
    'Machine learning',
  ],
  'Alpha-synuclein (aSyn)': 'alpha-synuclein interactions',
  fMRI: 'FMRI',
  GBA: 'GBA (Glucocerebrosidase)',
  Environment: 'Environment',
  Omics: 'Omics',
  'PD progression': 'PD progression',
  Seeding: 'Seeding assays',
  'Flow cytometry (FACS)': ['Flow cytometry', 'FACS'],
  'Western blot / Immunoblot': 'Western Blot',
  'Immunity and inflammation': 'Immunity',
  'Mitochondrial dysfunction': 'Mitochondrial dysfunction',
  Neurophysiology: 'Neurophysiology',
  Clearance: 'Clearance',
};

export const TAGS_TO_CREATE: string[] = ['Neurophysiology', 'Clearance'];

const AVATAR_OUTPUT_DIR = '/tmp/asap-import';
const LOCATION_MODEL = 'gpt-4o-2024-08-06'; // cheap but smart enough for the task
const MODEL_INPUT_COST_PER_MILLION = 2.5;
const MODEL_CACHED_INPUT_COST_PER_MILLION = 1.25;
const MODEL_OUTPUT_COST_PER_MILLION = 10;

export const NON_ARCHIVED_ENTRY_QUERY = {
  'sys.archivedAt[exists]': false,
} as const;

export const isArchivedResource = ({
  archivedAt,
  archivedVersion,
}: ArchivableSys): boolean =>
  typeof archivedVersion === 'number' || typeof archivedAt === 'string';

type OpenAiChatCompletionUsage = {
  prompt_tokens?: number;
  completion_tokens?: number;
  prompt_tokens_details?: {
    cached_tokens?: number;
  };
};

type OpenAiChatCompletionResponse = {
  usage?: OpenAiChatCompletionUsage;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type ParsedLocation = {
  city: string;
  state: string;
  country: string;
};

type ParsedLocationsPayload = {
  locations?: ParsedLocation[];
};

const LOCATION_RESPONSE_SCHEMA = {
  type: 'json_schema',
  json_schema: {
    name: 'parsed_locations',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        locations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              city: { type: 'string' },
              state: { type: 'string' },
              country: { type: 'string' },
            },
            required: ['city', 'state', 'country'],
            additionalProperties: false,
          },
        },
      },
      required: ['locations'],
      additionalProperties: false,
    },
  },
} as const;

const serializePreparedLocation = (location: ParsedLocation): string =>
  [location.city.trim(), location.state.trim(), location.country.trim()].join(
    '|',
  );

const parsePreparedLocation = (
  rawLocation: string,
): { city: string; stateOrProvince: string; country: string } => {
  const parts = rawLocation.split('|').map((part) => part.trim());

  if (parts.length !== 3) {
    throw new Error(
      `Prepared location must use city|state|country format: ${rawLocation}`,
    );
  }

  const [city, stateOrProvince, country] = parts;

  return {
    city: city || '',
    stateOrProvince: stateOrProvince || '',
    country: country || '',
  };
};

/** Reads a CSV file and returns trimmed headers plus raw rows. */
export const readCsv = (
  filePath: string,
): Promise<{ headers: string[]; rows: string[][] }> =>
  new Promise((resolve, reject) => {
    const rows: string[][] = [];
    let headers: string[] = [];
    const parser = csvParse({ relax_column_count: true });

    fs.createReadStream(filePath)
      .pipe(parser)
      .on('data', (row: string[]) => {
        if (headers.length === 0) {
          headers = row.map((h: string) => h.trim());
        } else {
          rows.push(row);
        }
      })
      .on('end', () => resolve({ headers, rows }))
      .on('error', reject);
  });

const escapeCsvField = (field: string): string => {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

export const writeCsv = (
  filePath: string,
  headers: string[],
  rows: string[][],
): void => {
  const lines = [
    headers.map(escapeCsvField).join(','),
    ...rows.map((row) => row.map(escapeCsvField).join(',')),
  ];
  // Write to temp file then rename to avoid corruption if the process crashes
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, `${lines.join('\n')}\n`);
  fs.renameSync(tmpPath, filePath);
};

export const col = (headers: string[], name: string): number => {
  const idx = headers.indexOf(name);
  // In practice should not happen because we have validated the headers at the very
  // beggining, but just in case...
  if (idx === -1) {
    throw new Error(
      `CSV column "${name}" not found. Available: ${headers.join(', ')}`,
    );
  }
  return idx;
};

export const validateRequiredColumns = (
  headers: string[],
  requiredColumns: string[],
): void => {
  for (const columnName of requiredColumns) {
    col(headers, columnName);
  }
};

export const cell = (row: string[], index: number): string =>
  (row[index] || '').trim();

const cellVal = (row: string[], headers: string[], name: string): string => {
  const idx = headers.indexOf(name);
  return idx >= 0 ? cell(row, idx) : '';
};

/** Parses CLI flags shared by the import scripts. */
export const parseImportArgs = (): ImportArgs => {
  const args = process.argv.slice(2);
  const prepareAvatars = args.includes('--prepare-avatars');
  const prepareLocations = args.includes('--prepare-locations');
  const prepareTags = args.includes('--prepare-tags');
  const csvPath = args.find((a) => !a.startsWith('--'));

  if (!csvPath) {
    throw new Error(
      'Usage: yarn import:<script> [--prepare-avatars] [--prepare-locations] [--prepare-tags] <csv-path>',
    );
  }

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  return {
    csvPath,
    prepareAvatars,
    prepareLocations,
    prepareTags,
    hasPrepareFlag: prepareAvatars || prepareLocations || prepareTags,
  };
};

/** Returns the reason a row should be skipped, or `null` when it should run. */
export const shouldSkipRow = (
  row: string[],
  headers: string[],
): string | null => {
  const hubRole = cellVal(row, headers, 'ASAP Hub Role');

  // Skip any non-empty row if ASAP Hub Role is empty.
  if (!hubRole) {
    return 'empty ASAP Hub Role';
  }

  // Skip if any assigned team role is UNKNOWN
  for (const num of ['1', '2', '3']) {
    const teamName = cellVal(row, headers, `Team ${num}`);
    const teamRole = cellVal(row, headers, `Team ${num} Role`);
    if (teamName && teamRole === 'UNKNOWN') {
      return `Team ${num} Role is UNKNOWN`;
    }
  }

  return null;
};

export const extractLinkedInId = (raw: string): string => {
  if (!raw) {
    return '';
  }
  const match = raw.match(/\/in\/([^/?]+)/);
  if (match) {
    const [, profileId = ''] = match;
    return profileId.replace(/\/$/, '');
  }
  if (raw.includes('http')) {
    console.warn(
      `  Warning: Dropping non-LinkedIn URL from LinkedIn field: ${raw}`,
    );
    return '';
  }
  return raw.replace(/\/$/, '');
};

export const extractTwitterId = (raw: string): string => {
  if (!raw) {
    return '';
  }
  if (raw.startsWith('@')) {
    return raw.slice(1);
  }
  const match = raw.match(/(?:twitter\.com|x\.com)\/([^/?]+)/);
  if (match) {
    const [, profileId = ''] = match;
    return profileId;
  }
  if (raw.includes('http')) {
    console.warn(`  Warning: Dropping non-Twitter/X URL from X field: ${raw}`);
    return '';
  }
  return raw;
};

export const extractGitHubId = (raw: string): string => {
  if (!raw) {
    return '';
  }

  const trimmed = raw.trim();
  const handlePattern = /^[A-Za-z0-9-]+$/;
  if (handlePattern.test(trimmed)) {
    return trimmed;
  }

  const looksLikeSchemeLessGitHubProfile =
    /^(github\.com|www\.github\.com)\//i.test(trimmed);
  const normalized = looksLikeSchemeLessGitHubProfile
    ? `https://${trimmed}`
    : trimmed;

  try {
    const parsedUrl = new URL(normalized);
    const host = parsedUrl.hostname.toLowerCase();
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);

    if (
      (host === 'github.com' || host === 'www.github.com') &&
      pathSegments.length === 1 &&
      handlePattern.test(pathSegments[0] || '')
    ) {
      return pathSegments[0] || '';
    }
  } catch {
    // Fall through to the warning below.
  }

  if (
    trimmed.includes('http') ||
    trimmed.toLowerCase().includes('github') ||
    trimmed.includes('/')
  ) {
    console.warn(
      `  Warning: Dropping non-GitHub profile from GitHub field: ${raw}`,
    );
  }

  return '';
};

export const extractGoogleScholarId = (raw: string): string => {
  if (!raw) {
    return '';
  }
  const match = raw.match(/[?&]user=([^&]+)/);
  if (match) {
    const [, userId = ''] = match;
    return userId;
  }
  if (raw.includes('http')) {
    console.warn(
      `  Warning: Dropping non-Scholar URL from Google Scholar field: ${raw}`,
    );
    return '';
  }
  return raw;
};

export const extractResearchGateId = (raw: string): string => {
  if (!raw) {
    return '';
  }
  const match = raw.match(/\/profile\/([^/?]+)/);
  if (match) {
    const [, profileId = ''] = match;
    return profileId;
  }
  const altMatch = raw.match(/\/scientific-contributions\/([^/?]+)/);
  if (altMatch) {
    const [, contributionId = ''] = altMatch;
    return contributionId;
  }
  if (raw.includes('http')) {
    console.warn(
      `  Warning: Dropping non-ResearchGate URL from ResearchGate field: ${raw}`,
    );
    return '';
  }
  return raw;
};

export const extractResearcherId = (raw: string): string => {
  if (!raw) {
    return '';
  }
  const wosMatch = raw.match(/\/record\/([^/?]+)/);
  if (wosMatch) {
    const [, recordId = ''] = wosMatch;
    return recordId;
  }
  const ridMatch = raw.match(/\/rid\/([^/?]+)/);
  if (ridMatch) {
    const [, researcherId = ''] = ridMatch;
    return researcherId;
  }
  if (raw.includes('http')) {
    console.warn(
      `  Warning: Dropping non-ResearcherID URL from ResearcherID field: ${raw}`,
    );
    return '';
  }
  return raw;
};

// Drop known junk values and prose responses from social fields.
// A valid social link ID or handle never contains spaces.
const SOCIAL_JUNK_VALUES = new Set(['n/a', 'na', 'none', '-']);

export const sanitizeSocialValue = (value: string): string => {
  if (!value) {
    return '';
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  if (SOCIAL_JUNK_VALUES.has(trimmed.toLowerCase())) {
    return '';
  }
  if (trimmed.includes(' ')) {
    return '';
  }
  return trimmed;
};

/**
 * Normalizes website fields to valid HTTP(S) URLs so they can be published.
 * Bare domains are upgraded to `https://...`. Placeholder values are dropped.
 */
export const sanitizeWebsiteUrl = (raw: string, fieldName: string): string => {
  if (!raw) {
    return '';
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return '';
  }

  if (SOCIAL_JUNK_VALUES.has(trimmed.toLowerCase())) {
    console.warn(
      `  Warning: Dropping placeholder value from ${fieldName}: ${raw}`,
    );
    return '';
  }

  const hasExplicitScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed);
  const normalized = hasExplicitScheme ? trimmed : `https://${trimmed}`;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(normalized);
  } catch {
    console.warn(`  Warning: Dropping invalid URL from ${fieldName}: ${raw}`);
    return '';
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    console.warn(
      `  Warning: Dropping unsupported URL scheme from ${fieldName}: ${raw}`,
    );
    return '';
  }

  if (!parsedUrl.hostname || !parsedUrl.hostname.includes('.')) {
    console.warn(`  Warning: Dropping invalid URL from ${fieldName}: ${raw}`);
    return '';
  }

  if (!hasExplicitScheme) {
    console.warn(
      `  Warning: Normalizing ${fieldName} by adding https://: ${raw}`,
    );
  }

  return normalized;
};

export const extractBlueskyHandle = (raw: string): string => {
  if (!raw) {
    return '';
  }
  if (raw.startsWith('@')) {
    return raw.slice(1);
  }
  const match = raw.match(/bsky\.app\/profile\/([^/?]+)/);
  if (match) {
    const [, handle = ''] = match;
    return handle;
  }
  if (raw.includes('http')) {
    console.warn(
      `  Warning: Dropping non-Bluesky URL from Bluesky field: ${raw}`,
    );
    return '';
  }
  return raw;
};

/** Normalizes ORCID values into the bare identifier format stored in CMS. */
export const cleanOrcid = (raw: string): string => {
  if (!raw) {
    return '';
  }
  return raw
    .replace(/^https?:\/\/orcid\.org\//, '')
    .replace(/^orcid\.org\//, '')
    .trim();
};

/** Keeps only supported degree values and collapses `MD` plus `PhD` into one value. */
export const filterDegree = (raw: string): string | undefined => {
  if (!raw) {
    return undefined;
  }
  if (VALID_DEGREES.includes(raw)) {
    return raw;
  }

  const parts = raw.split(',').map((p) => p.trim());
  const validParts = parts.filter((p) => VALID_DEGREES.includes(p));
  const droppedParts = parts.filter((p) => !VALID_DEGREES.includes(p));

  if (droppedParts.length > 0) {
    console.warn(
      `  Warning: Dropping invalid degree(s): ${droppedParts.join(', ')}`,
    );
  }

  if (validParts.length === 0) {
    return undefined;
  }

  if (validParts.includes('MD') && validParts.includes('PhD')) {
    return 'MD, PhD';
  }

  return validParts[0];
};

export const parseOpenQuestions = (
  q1: string,
  q2: string,
  q3: string,
  q4: string,
): string[] => [q1, q2, q3, q4].filter((q) => q.length > 0);

export const mapTeamRole = (csvRole: string): string => {
  const mapped = TEAM_ROLE_MAPPING[csvRole];
  if (!mapped) {
    console.warn(`  Warning: No role mapping for "${csvRole}", using as-is`);
    return csvRole;
  }
  return mapped;
};

export const isEmptyRow = (row: string[]): boolean =>
  row.every((value) => !value || value.trim() === '');

/** Parses a raw CSV row into the normalized user shape used by the import scripts. */
export const parseUserRow = (
  row: string[],
  headers: string[],
): ParsedUserData => {
  const v = (name: string) => cellVal(row, headers, name);

  const rawLocation = v('Location');
  const { city, stateOrProvince, country } = rawLocation.includes('|')
    ? parsePreparedLocation(rawLocation)
    : { city: '', stateOrProvince: '', country: '' };

  const tagStr = v('Tags');
  const tagNames = tagStr
    ? tagStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const teams: Array<{ name: string; role: string }> = [];
  for (const num of ['1', '2', '3']) {
    const teamName = v(`Team ${num}`);
    const teamRole = v(`Team ${num} Role`);
    if (teamName && teamRole && teamRole !== 'UNKNOWN') {
      teams.push({ name: teamName, role: teamRole });
    }
  }

  const role = v('ASAP Hub Role') || undefined;

  return {
    firstName: v('First name'),
    nickname: v('Preferred name'),
    lastName: v('Last name'),
    email: v('Email address').toLowerCase(),
    orcid: cleanOrcid(v('ORCID')),
    degree: filterDegree(v('Degree')),
    rawLocation,
    city,
    stateOrProvince,
    country,
    jobTitle: v('Position title'),
    institution: v('Institution'),
    avatarSource: v('Please upload a profile photo.'),
    website1: sanitizeWebsiteUrl(v('Website 1'), 'Website 1'),
    website2: sanitizeWebsiteUrl(v('Website 2'), 'Website 2'),
    linkedIn: extractLinkedInId(sanitizeSocialValue(v('LinkedIn'))),
    researcherId: extractResearcherId(sanitizeSocialValue(v('ResearcherID'))),
    twitter: extractTwitterId(sanitizeSocialValue(v('X'))),
    blueSky: extractBlueskyHandle(sanitizeSocialValue(v('Bluesky'))),
    github: extractGitHubId(sanitizeSocialValue(v('GitHub'))),
    googleScholar: extractGoogleScholarId(
      sanitizeSocialValue(v('Google Scholar')),
    ),
    researchGate: extractResearchGateId(sanitizeSocialValue(v('ResearchGate'))),
    responsibilities: v('Responsibilities'),
    researchInterests: v('Research Interests'),
    expertiseAndResourceDescription: v('Expertise and resources description'),
    tagNames,
    questions: parseOpenQuestions(
      v('Open question 1'),
      v('Open question 2'),
      v('Open question 3'),
      v('Open question 4'),
    ),
    biography: v('Biography'),
    role,
    teams,
  };
};

/** Creates a rate-limited Contentful environment client from env vars. */
export const getContentfulEnvironment = async (): Promise<Environment> => {
  const accessToken = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN;
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const envId = process.env.CONTENTFUL_ENV_ID;

  if (!accessToken || !spaceId || !envId) {
    throw new Error(
      'Missing env vars: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN, CONTENTFUL_SPACE_ID, CONTENTFUL_ENV_ID',
    );
  }

  console.log(
    `Connecting to Contentful environment: ${envId} (using safe rate-limited client)`,
  );
  return getRestClient({
    space: spaceId,
    accessToken,
    environment: envId,
  });
};

/** Wraps a value in the default Contentful locale. */
export const loc = <T>(value: T): LocalizedField<T> => ({ 'en-US': value });

/** Creates a Contentful entry link object. */
export const createEntryLink = (id: string): Link<'Entry'> => getLinkEntity(id);

/** Creates a Contentful asset link object. */
export const createAssetLink = (id: string): Link<'Asset'> => getLinkAsset(id);

const teamCache = new Map<string, string | null>();

/** Finds a team by display name and caches the result for later lookups. */
export const findTeamByName = async (
  env: Environment,
  displayName: string,
): Promise<{ id: string } | null> => {
  if (teamCache.has(displayName)) {
    const cached = teamCache.get(displayName);
    return cached ? { id: cached } : null;
  }

  const entries = await env.getEntries({
    ...NON_ARCHIVED_ENTRY_QUERY,
    content_type: 'teams',
    'fields.displayName': displayName,
    limit: 1,
  });

  const [firstItem] = entries.items;
  const id = firstItem ? firstItem.sys.id : null;
  teamCache.set(displayName, id);
  return id ? { id } : null;
};

export const clearTeamCache = () => teamCache.clear();

/** Finds a project by its short project ID. */
export const findProjectByProjectId = async (
  env: Environment,
  projectId: string,
): Promise<ContentfulEntryLookup | null> => {
  const entries = await env.getEntries({
    ...NON_ARCHIVED_ENTRY_QUERY,
    content_type: 'projects',
    'fields.projectId': projectId,
    limit: 1,
  });
  const [firstItem] = entries.items;
  if (!firstItem) {
    return null;
  }
  return { id: firstItem.sys.id, entry: firstItem };
};

/** Finds a user by ORCID. */
export const findUserByOrcid = async (
  env: Environment,
  orcid: string,
): Promise<ContentfulEntryLookup | null> => {
  const entries = await env.getEntries({
    ...NON_ARCHIVED_ENTRY_QUERY,
    content_type: 'users',
    'fields.orcid': orcid,
    limit: 1,
  });
  const [firstItem] = entries.items;
  if (!firstItem) {
    return null;
  }
  return { id: firstItem.sys.id, entry: firstItem };
};

/** Finds a user by normalized email address. */
export const findUserByEmail = async (
  env: Environment,
  email: string,
): Promise<ContentfulEntryLookup | null> => {
  const entries = await env.getEntries({
    ...NON_ARCHIVED_ENTRY_QUERY,
    content_type: 'users',
    'fields.email': email,
    limit: 1,
  });
  const [firstItem] = entries.items;
  if (!firstItem) {
    return null;
  }
  return { id: firstItem.sys.id, entry: firstItem };
};

/** Creates a draft team membership entry for a user and team pair. */
export const createTeamMembership = async (
  env: Environment,
  teamId: string,
  role: string,
): Promise<string> => {
  const entry = await env.createEntry('teamMembership', {
    fields: {
      team: loc(createEntryLink(teamId)),
      role: loc(mapTeamRole(role)),
    },
  });
  return entry.sys.id;
};

/** Uploads a local avatar file to Contentful and returns the asset ID. */
export const uploadAvatar = async (
  env: Environment,
  localPath: string,
  userName: string,
): Promise<string> => {
  const fileBuffer = fs.readFileSync(localPath);
  const ext = path.extname(localPath).toLowerCase();
  const contentType =
    ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : 'image/jpeg';
  const fileName = `${userName.replace(/\s+/g, '-').toLowerCase()}${
    ext || '.jpg'
  }`;

  const asset = await env.createAssetFromFiles({
    fields: {
      title: loc(`Profile - ${userName}`),
      description: loc(''),
      file: loc({
        contentType,
        fileName,
        file: fileBuffer,
      }),
    },
  });

  const processed = await asset.processForAllLocales();
  return processed.sys.id;
};

/** Checks whether a user already links to a membership for the given team. */
export const userHasTeamMembership = async (
  env: Environment,
  userEntry: Entry,
  targetTeamId: string,
): Promise<boolean> => {
  const teamsField = (userEntry.fields?.teams?.['en-US'] || []) as Array<
    Link<'Entry'>
  >;

  for (const link of teamsField) {
    try {
      const membership = await env.getEntry(link.sys.id);
      if (isArchivedResource(membership.sys)) {
        continue;
      }
      const membershipTeamId = membership.fields?.team?.['en-US']?.sys?.id;
      if (membershipTeamId === targetTeamId) {
        return true;
      }
    } catch {
      // Entry might not exist or be inaccessible
    }
  }
  return false;
};

/**
 * Deletes draft entries created during a failed row import.
 * This is best-effort and only logs cleanup failures.
 */
export const cleanupEntries = async (
  env: Environment,
  entryIds: string[],
  label: string,
): Promise<void> => {
  for (const id of entryIds) {
    try {
      const entry = await env.getEntry(id);
      if (!entry.isPublished()) {
        await entry.delete();
        console.warn(`  Cleaned up ${label}: ${id}`);
      }
    } catch {
      console.warn(`  Failed to clean up ${label}: ${id}`);
    }
  }
};

/** Deletes a draft asset created during a failed row import. */
export const cleanupAsset = async (
  env: Environment,
  assetId: string,
): Promise<void> => {
  try {
    const asset = await env.getAsset(assetId);
    if (!asset.isPublished()) {
      await asset.delete();
      console.warn(`  Cleaned up asset: ${assetId}`);
    }
  } catch {
    console.warn(`  Failed to clean up asset: ${assetId}`);
  }
};

let tagIdCache: Map<string, string> | null = null;

/** Loads all research tags into an in-memory lookup cache. */
export const loadTagCache = async (env: Environment): Promise<void> => {
  tagIdCache = new Map();
  let skip = 0;
  const limit = 1000;
  let total = limit;

  while (skip < total) {
    const response = await env.getEntries({
      ...NON_ARCHIVED_ENTRY_QUERY,
      content_type: 'researchTags',
      limit,
      skip,
    });
    total = response.total;

    for (const item of response.items) {
      const name = item.fields?.name?.['en-US'] as string;
      if (name) {
        tagIdCache.set(name, item.sys.id);
      }
    }

    skip += limit;
  }

  console.log(`Loaded ${tagIdCache.size} tags from Contentful`);
};

/** Resolves normalized tag names into Contentful entry IDs. */
export const resolveTagIds = (tagNames: string[]): string[] => {
  if (!tagIdCache) {
    throw new Error('Tag cache not loaded. Call loadTagCache() first.');
  }

  const ids: string[] = [];
  for (const name of tagNames) {
    const id = tagIdCache.get(name);
    if (id) {
      ids.push(id);
    } else {
      console.warn(`  Warning: Tag "${name}" not found in CMS, skipping`);
    }
  }
  return ids;
};

/** Expands raw CSV tag labels into their normalized CMS equivalents. */
export const normalizeTagNames = (csvTags: string[]): string[] => {
  const result: string[] = [];
  for (const tag of csvTags) {
    const mapped = TAG_MAPPING[tag];
    if (mapped === null) {
      console.warn(
        `  Warning: Tag "${tag}" is pending clarification and will be skipped`,
      );
    } else if (mapped) {
      if (Array.isArray(mapped)) {
        result.push(...mapped);
      } else {
        result.push(mapped);
      }
    } else {
      result.push(tag);
    }
  }
  return result;
};

/** Extracts the Google Drive file ID from a supported share URL. */
export const extractGoogleDriveFileId = (url: string): string | null => {
  const openMatch = url.match(/[?&]id=([^&]+)/);
  if (openMatch) {
    const [, fileId = ''] = openMatch;
    return fileId;
  }
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) {
    const [, fileId = ''] = fileMatch;
    return fileId;
  }
  return null;
};

/** Downloads a Google Drive image to the local avatar cache directory. */
export const downloadGoogleDriveImage = async (
  url: string,
): Promise<string> => {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) {
    throw new Error(`Cannot extract file ID from Drive URL: ${url}`);
  }

  fs.mkdirSync(AVATAR_OUTPUT_DIR, { recursive: true });

  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const response = await fetch(downloadUrl, { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(`Failed to download image: HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(
      `Drive returned non-image Content-Type "${contentType}" for file ${fileId} (possibly a permissions page)`,
    );
  }
  const ext = contentType.includes('png')
    ? '.png'
    : contentType.includes('gif')
      ? '.gif'
      : '.jpg';
  const outputPath = path.join(AVATAR_OUTPUT_DIR, `${fileId}${ext}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
};

/** Downloads avatar images referenced by Google Drive URLs and rewrites the rows in place. */
export const prepareAvatars = async (
  rows: string[][],
  headers: string[],
): Promise<{ downloaded: number; skipped: number; failed: number }> => {
  const colIdx = col(headers, 'Please upload a profile photo.');
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const [index, row] of rows.entries()) {
    const avatarCell = (row[colIdx] || '').trim();

    if (
      !avatarCell ||
      avatarCell.startsWith('/') ||
      !avatarCell.includes('drive.google.com')
    ) {
      skipped += 1;
    } else {
      try {
        const localPath = await downloadGoogleDriveImage(avatarCell);
        row[colIdx] = localPath;
        downloaded += 1;
        console.log(
          `  Downloaded image ${downloaded}: ${path.basename(localPath)}`,
        );
      } catch (error: unknown) {
        failed += 1;
        console.error(
          `  Failed to download image for row ${index + 2}: ${getErrorMessage(
            error,
          )}`,
        );
      }
    }
  }

  return { downloaded, skipped, failed };
};

/** Resolves free-form locations via OpenAI and rewrites the rows in place. */
export const prepareLocations = async (
  rows: string[][],
  headers: string[],
): Promise<{ processed: number; cost: string }> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required for location parsing');
  }

  const colIdx = col(headers, 'Location');
  let totalInputTokens = 0;
  let totalCachedInputTokens = 0;
  let totalOutputTokens = 0;

  const uniqueLocations = new Map<
    string,
    { city: string; state: string; country: string }
  >();
  for (const row of rows) {
    const rawLoc = (row[colIdx] || '').trim();
    if (rawLoc && !rawLoc.includes('|')) {
      uniqueLocations.set(rawLoc, { city: '', state: '', country: '' });
    }
  }

  if (uniqueLocations.size === 0) {
    console.log('All locations already prepared, nothing to do');
    return { processed: 0, cost: '$0.00' };
  }

  console.log(`Parsing ${uniqueLocations.size} unique locations via OpenAI...`);

  const locationList = Array.from(uniqueLocations.keys());
  const batchSize = 30;

  for (
    let batchStart = 0;
    batchStart < locationList.length;
    batchStart += batchSize
  ) {
    const batch = locationList.slice(batchStart, batchStart + batchSize);
    const numbered = batch
      .map((location, idx) => `${idx + 1}. ${location}`)
      .join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: LOCATION_MODEL,
        response_format: LOCATION_RESPONSE_SCHEMA,
        messages: [
          {
            role: 'system',
            content:
              'Parse each numbered location into city, state/province, and country. ' +
              'Infer the country when it can be determined with high confidence from the city and/or state, such as San Diego, California -> USA and Munich -> Germany. ' +
              'Always include the country when you can infer it with high confidence. ' +
              'Only include state/province when it is provided or strongly implied by the input. ' +
              'Return exactly one object per numbered input, in the same order, with no omissions, no extras, and no reordering. ' +
              'Return a JSON object with key "locations" containing an array where each element ' +
              'has "city", "state", and "country" keys. Use full state names (e.g., "Illinois" not "IL") and use "USA" for the United States. ' +
              'Examples: "Munich, Germany" -> {"city":"Munich","state":"","country":"Germany"}; "San Diego, CA" -> {"city":"San Diego","state":"California","country":"USA"}; "Bonn" -> {"city":"Bonn","state":"","country":""}; "Germany" -> {"city":"","state":"","country":"Germany"}; if the state is known but the country is genuinely unknown, return an empty country string rather than moving the state into the country field. ' +
              'Use an empty string only when a component is genuinely unknown. ' +
              `The array must have exactly ${batch.length} elements because the input list has ${batch.length} items.`,
          },
          { role: 'user', content: numbered },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as OpenAiChatCompletionResponse;
    const usage = data.usage || {};
    const promptTokens = usage.prompt_tokens || 0;
    const cachedPromptTokens = usage.prompt_tokens_details?.cached_tokens || 0;
    const nonCachedPromptTokens = Math.max(
      promptTokens - cachedPromptTokens,
      0,
    );

    totalInputTokens += nonCachedPromptTokens;
    totalCachedInputTokens += cachedPromptTokens;
    totalOutputTokens += usage.completion_tokens || 0;

    const content = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content) as
      | ParsedLocationsPayload
      | ParsedLocation[];
    const results = Array.isArray(parsed) ? parsed : parsed.locations ?? [];

    if (!Array.isArray(results)) {
      throw new Error(
        `OpenAI returned a non-array locations payload for batch ${
          Math.floor(batchStart / batchSize) + 1
        }`,
      );
    }

    if (results.length !== batch.length) {
      throw new Error(
        `OpenAI returned ${results.length} locations for batch ${
          Math.floor(batchStart / batchSize) + 1
        } but ${batch.length} were requested. Batch inputs: ${batch.join(
          ' | ',
        )}`,
      );
    }

    for (let j = 0; j < batch.length; j += 1) {
      const result = results[j] || { city: '', state: '', country: '' };
      const batchLocation = batch[j];
      if (batchLocation) {
        uniqueLocations.set(batchLocation, {
          city: result.city || '',
          state: result.state || '',
          country: result.country || '',
        });
      }
    }

    console.log(
      `  Parsed batch ${Math.floor(batchStart / batchSize) + 1}/${Math.ceil(
        locationList.length / batchSize,
      )}`,
    );
  }

  let processed = 0;
  for (const row of rows) {
    const rawLoc = (row[colIdx] || '').trim();
    if (rawLoc && !rawLoc.includes('|')) {
      const resolved = uniqueLocations.get(rawLoc);
      if (resolved) {
        row[colIdx] = serializePreparedLocation(resolved);
        processed += 1;
      }
    }
  }

  const totalCost =
    (totalInputTokens * MODEL_INPUT_COST_PER_MILLION) / 1_000_000 +
    (totalCachedInputTokens * MODEL_CACHED_INPUT_COST_PER_MILLION) / 1_000_000 +
    (totalOutputTokens * MODEL_OUTPUT_COST_PER_MILLION) / 1_000_000;
  const cost = `$${totalCost.toFixed(
    4,
  )} (${totalInputTokens} input + ${totalCachedInputTokens} cached input + ${totalOutputTokens} output tokens)`;

  return { processed, cost };
};

/**
 * Normalizes tags, creates any configured missing tags, and rewrites the rows in place.
 */
export const prepareTags = async (
  rows: string[][],
  headers: string[],
  env: Environment,
): Promise<{
  normalized: number;
  created: number;
  publishedDrafts: number;
}> => {
  const colIdx = col(headers, 'Tags');
  const approvedTagEntries = new Map<string, Entry>();

  if (TAGS_TO_CREATE.length > 0) {
    const existingApprovedTags = await env.getEntries({
      ...NON_ARCHIVED_ENTRY_QUERY,
      content_type: 'researchTags',
      'fields.name[in]': TAGS_TO_CREATE.join(','),
      limit: TAGS_TO_CREATE.length,
    });

    for (const entry of existingApprovedTags.items) {
      const name = entry.fields?.name?.['en-US'] as string | undefined;
      if (name) {
        approvedTagEntries.set(name, entry);
      }
    }
  }

  await loadTagCache(env);
  if (!tagIdCache) {
    throw new Error('Tag cache not loaded. Call loadTagCache() first.');
  }

  let created = 0;
  let publishedDrafts = 0;
  for (const tagName of TAGS_TO_CREATE) {
    const existingTag = approvedTagEntries.get(tagName);

    if (!existingTag) {
      console.log(`  Creating and publishing new tag: "${tagName}"`);
      const entry = await env.createEntry('researchTags', {
        fields: { name: loc(tagName) },
      });

      const publishedEntry = await entry.publish();
      approvedTagEntries.set(tagName, publishedEntry);
      created += 1;
    } else if (existingTag.isDraft()) {
      const publishedEntry = await existingTag.publish();

      approvedTagEntries.set(tagName, publishedEntry);
      publishedDrafts += 1;
      console.log(
        `  Published existing draft tag: "${tagName}" (${publishedEntry.sys.id})`,
      );
    }
  }

  // Reload cache to include newly created tags
  if (created > 0) {
    await loadTagCache(env);
  }

  let normalized = 0;
  for (const row of rows) {
    const tagStr = (row[colIdx] || '').trim();
    if (tagStr) {
      const csvTags = tagStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const normalizedTags = normalizeTagNames(csvTags);

      if (JSON.stringify(csvTags) !== JSON.stringify(normalizedTags)) {
        normalized += 1;
      }

      row[colIdx] = normalizedTags.join(', ');
    }
  }

  return { normalized, created, publishedDrafts };
};

/**
 * Builds the Contentful user fields payload shared by both user import scripts.
 * Pass explicit options so the caller makes it clear whether the payload is for
 * new-user creation or an update to an existing user.
 *
 * Use `CREATE_USER_FIELDS_OPTIONS` for new users and
 * `UPDATE_USER_FIELDS_OPTIONS` for updates to existing users.
 */
export const buildUserFields = (
  data: ParsedUserData,
  teamMembershipIds: string[],
  tagIds: string[],
  avatarId: string | null,
  options: BuildUserFieldsOptions,
  existingTeams: Array<Link<'Entry'>> = [],
): LocalizedFields => {
  const { includeEmail, requireRole } = options;
  const fields: LocalizedFields = {};

  if (requireRole && !data.role) {
    throw new Error('ASAP Hub Role is required for new users');
  }

  fields.firstName = loc(data.firstName);
  fields.lastName = loc(data.lastName);
  if (includeEmail && data.email) {
    fields.email = loc(data.email);
  }
  if (data.role) {
    fields.role = loc(data.role);
  }
  fields.lastUpdated = loc(new Date().toISOString());

  if (data.nickname) {
    fields.nickname = loc(data.nickname);
  }
  if (data.orcid) {
    fields.orcid = loc(data.orcid);
  }
  if (data.degree) {
    fields.degree = loc(data.degree);
  }
  if (data.city) {
    fields.city = loc(data.city);
  }
  if (data.stateOrProvince) {
    fields.stateOrProvince = loc(data.stateOrProvince);
  }
  if (data.country) {
    fields.country = loc(data.country);
  }
  if (data.jobTitle) {
    fields.jobTitle = loc(data.jobTitle);
  }
  if (data.institution) {
    fields.institution = loc(data.institution);
  }

  if (data.website1) {
    fields.website1 = loc(data.website1);
  }
  if (data.website2) {
    fields.website2 = loc(data.website2);
  }
  if (data.linkedIn) {
    fields.linkedIn = loc(data.linkedIn);
  }
  if (data.researcherId) {
    fields.researcherId = loc(data.researcherId);
  }
  if (data.twitter) {
    fields.twitter = loc(data.twitter);
  }
  if (data.github) {
    fields.github = loc(data.github);
  }
  if (data.googleScholar) {
    fields.googleScholar = loc(data.googleScholar);
  }
  if (data.researchGate) {
    fields.researchGate = loc(data.researchGate);
  }
  if (data.blueSky) {
    fields.blueSky = loc(data.blueSky);
  }

  if (data.responsibilities) {
    fields.responsibilities = loc(data.responsibilities);
  }
  if (data.researchInterests) {
    fields.researchInterests = loc(data.researchInterests);
  }
  if (data.expertiseAndResourceDescription) {
    fields.expertiseAndResourceDescription = loc(
      data.expertiseAndResourceDescription,
    );
  }
  if (data.biography) {
    fields.biography = loc(data.biography);
  }

  if (data.questions.length > 0) {
    fields.questions = loc(data.questions);
  }

  if (tagIds.length > 0) {
    fields.researchTags = loc(tagIds.map(createEntryLink));
  }

  if (avatarId) {
    fields.avatar = loc(createAssetLink(avatarId));
  }

  const newTeamLinks = teamMembershipIds.map(createEntryLink);
  fields.teams = loc([...existingTeams, ...newTeamLinks]);

  return fields;
};

/**
 * Runs the requested prepare steps and writes the CSV back only when prepare flags are used.
 * Returns any reused Contentful environment plus a flag telling the caller to exit early.
 */
export const runPrepareSteps = async (
  args: ImportArgs,
  rows: string[][],
  headers: string[],
): Promise<{ shouldExit: boolean; env: Environment | null }> => {
  const shouldPrepareAvatars = args.prepareAvatars || !args.hasPrepareFlag;
  const shouldPrepareLocations = args.prepareLocations || !args.hasPrepareFlag;
  const shouldPrepareTags = args.prepareTags || !args.hasPrepareFlag;
  let env: Environment | null = null;

  if (shouldPrepareAvatars) {
    console.log('\n--- Preparing avatars ---');
    const result = await prepareAvatars(rows, headers);
    console.log(
      `Avatars: ${result.downloaded} downloaded, ${result.skipped} skipped, ${result.failed} failed`,
    );
  }

  if (shouldPrepareLocations) {
    console.log('\n--- Preparing locations ---');
    const result = await prepareLocations(rows, headers);
    console.log(
      `Locations: ${result.processed} processed. Cost: ${result.cost}`,
    );
  }

  if (shouldPrepareTags) {
    env = await getContentfulEnvironment();
    console.log('\n--- Preparing tags ---');
    const result = await prepareTags(rows, headers, env);
    console.log(
      `Tags: ${result.normalized} normalized, ${result.created} new tags created and published, ${result.publishedDrafts} existing draft tags published`,
    );
  }

  if (args.hasPrepareFlag) {
    writeCsv(args.csvPath, headers, rows);
    console.log(`\nCSV updated: ${args.csvPath}`);
    return { shouldExit: true, env };
  }

  return { shouldExit: false, env };
};
