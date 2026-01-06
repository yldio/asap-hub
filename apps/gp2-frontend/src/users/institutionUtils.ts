import { getInstitutions } from './api';

type RorInstitutionName = {
  readonly value: string;
  readonly types?: ReadonlyArray<string>;
  readonly lang: string | null;
};

type RorInstitution = {
  readonly names?: ReadonlyArray<RorInstitutionName>;
};

type RorApiResponse = {
  readonly items?: ReadonlyArray<RorInstitution>;
};

export const extractInstitutionDisplayName = (
  institution: RorInstitution,
): string | null => {
  const { names } = institution;
  if (!names || names.length === 0) {
    return null;
  }

  const displayName = names.find((name) => name.types?.includes('ror_display'));
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
