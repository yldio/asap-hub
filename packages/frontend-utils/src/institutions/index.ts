import {
  InstitutionsResponse,
  RorInstitutionItem,
  RorInstitutionName,
} from '@asap-hub/model';

export type RorApiResponse = {
  readonly items?: ReadonlyArray<RorInstitutionItem>;
};

export const getInstitutions = async ({
  searchQuery,
}: {
  searchQuery?: string;
} = {}): Promise<InstitutionsResponse> => {
  const url = new URL('https://api.ror.org/v2/organizations');
  searchQuery && url.searchParams.set('query', searchQuery);
  const resp = await fetch(url.toString());
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch institutions. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const extractInstitutionDisplayName = (
  institution: RorInstitutionItem,
): string | null => {
  const { names } = institution;
  if (!names || names.length === 0) {
    return null;
  }

  const displayName = names.find(
    (name: RorInstitutionName) => name.types?.includes('ror_display'),
  );
  const fallbackName = names[0];

  return displayName?.value || fallbackName?.value || null;
};

export const transformRorInstitutionsToNames = (
  response: RorApiResponse,
): string[] => {
  const items = response?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  return items
    .map(extractInstitutionDisplayName)
    .filter((name): name is string => name !== null);
};

export const loadInstitutionOptions = async (
  searchQuery?: string,
): Promise<string[]> => {
  try {
    const response = await getInstitutions({ searchQuery });
    return transformRorInstitutionsToNames(response as RorApiResponse);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load institutions:', error);
    return [];
  }
};
