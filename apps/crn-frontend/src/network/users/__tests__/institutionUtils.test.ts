import {
  extractInstitutionDisplayName,
  transformRorInstitutionsToNames,
  loadInstitutionOptions,
  type RorInstitutionName,
  type RorApiResponse,
} from '../Editing';
import { getInstitutions } from '../api';

jest.mock('../api');
const mockGetInstitutions = getInstitutions as jest.MockedFunction<
  typeof getInstitutions
>;

describe('extractInstitutionDisplayName', () => {
  it('returns the display name when ror_display type is present', () => {
    const institution = {
      names: [
        {
          value: 'Acronym Name',
          types: ['acronym'],
          lang: null,
        },
        {
          value: 'Display Name',
          types: ['ror_display', 'label'],
          lang: 'en',
        },
        {
          value: 'Alias Name',
          types: ['alias'],
          lang: 'en',
        },
      ],
    };

    expect(extractInstitutionDisplayName(institution)).toBe('Display Name');
  });

  it('returns the first name when ror_display type is not present', () => {
    const institution = {
      names: [
        {
          value: 'First Name',
          types: ['label'],
          lang: 'en',
        },
        {
          value: 'Second Name',
          types: ['alias'],
          lang: 'en',
        },
      ],
    };

    expect(extractInstitutionDisplayName(institution)).toBe('First Name');
  });

  it('returns null when names array is empty', () => {
    const institution = {
      names: [],
    };

    expect(extractInstitutionDisplayName(institution)).toBeNull();
  });

  it('returns null when names is undefined', () => {
    const institution = {};

    expect(extractInstitutionDisplayName(institution)).toBeNull();
  });

  it('returns null when name value is missing', () => {
    const institution = {
      names: [
        {
          types: ['ror_display'],
          lang: 'en',
        } as unknown as RorInstitutionName,
      ],
    };

    expect(extractInstitutionDisplayName(institution)).toBeNull();
  });

  it('handles names with empty types array', () => {
    const institution = {
      names: [
        {
          value: 'Name Without Types',
          types: [],
          lang: null,
        },
      ],
    };

    expect(extractInstitutionDisplayName(institution)).toBe(
      'Name Without Types',
    );
  });
});

describe('transformRorInstitutionsToNames', () => {
  it('transforms valid ROR API response to array of names', () => {
    const response = {
      items: [
        {
          names: [
            {
              value: 'University A',
              types: ['ror_display', 'label'],
              lang: 'en',
            },
          ],
        },
        {
          names: [
            {
              value: 'University B',
              types: ['label'],
              lang: 'en',
            },
          ],
        },
      ],
    };

    expect(transformRorInstitutionsToNames(response)).toEqual([
      'University A',
      'University B',
    ]);
  });

  it('filters out institutions without valid names', () => {
    const response = {
      items: [
        {
          names: [
            {
              value: 'Valid University',
              types: ['ror_display'],
              lang: 'en',
            },
          ],
        },
        {
          names: [],
        },
        {
          names: [
            {
              value: 'Another Valid University',
              types: ['label'],
              lang: 'en',
            },
          ],
        },
        {},
      ],
    };

    expect(transformRorInstitutionsToNames(response)).toEqual([
      'Valid University',
      'Another Valid University',
    ]);
  });

  it('returns empty array when items is empty', () => {
    const response = {
      items: [],
    };

    expect(transformRorInstitutionsToNames(response)).toEqual([]);
  });

  it('returns empty array when items is undefined', () => {
    const response = {};

    expect(transformRorInstitutionsToNames(response)).toEqual([]);
  });

  it('returns empty array when response is undefined', () => {
    expect(
      transformRorInstitutionsToNames(undefined as unknown as RorApiResponse),
    ).toEqual([]);
  });

  it('returns empty array when items is not an array', () => {
    const response = {
      items: 'not an array',
    } as unknown as RorApiResponse;

    expect(transformRorInstitutionsToNames(response)).toEqual([]);
  });

  it('handles complex names array with multiple types', () => {
    const response = {
      items: [
        {
          names: [
            {
              value: 'Acronym',
              types: ['acronym'],
              lang: null,
            },
            {
              value: 'Official Name',
              types: ['ror_display', 'label'],
              lang: 'en',
            },
          ],
        },
      ],
    };

    expect(transformRorInstitutionsToNames(response)).toEqual([
      'Official Name',
    ]);
  });
});

describe('loadInstitutionOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads and transforms institutions successfully', async () => {
    const mockResponse = {
      items: [
        {
          names: [
            {
              value: 'Test University',
              types: ['ror_display', 'label'],
              lang: 'en',
            },
          ],
        },
      ],
    };

    mockGetInstitutions.mockResolvedValue(
      mockResponse as unknown as Awaited<ReturnType<typeof getInstitutions>>,
    );

    const result = await loadInstitutionOptions('test');

    expect(result).toEqual(['Test University']);
    expect(mockGetInstitutions).toHaveBeenCalledWith({ searchQuery: 'test' });
  });

  it('handles empty search query', async () => {
    const mockResponse = {
      items: [
        {
          names: [
            {
              value: 'Default University',
              types: ['label'],
              lang: 'en',
            },
          ],
        },
      ],
    };

    mockGetInstitutions.mockResolvedValue(
      mockResponse as unknown as Awaited<ReturnType<typeof getInstitutions>>,
    );

    const result = await loadInstitutionOptions();

    expect(result).toEqual(['Default University']);
    expect(mockGetInstitutions).toHaveBeenCalledWith({
      searchQuery: undefined,
    });
  });

  it('returns empty array when API returns empty items', async () => {
    mockGetInstitutions.mockResolvedValue({
      items: [],
    } as unknown as Awaited<ReturnType<typeof getInstitutions>>);

    const result = await loadInstitutionOptions('query');

    expect(result).toEqual([]);
  });

  it('returns empty array when API returns no items property', async () => {
    mockGetInstitutions.mockResolvedValue(
      {} as unknown as Awaited<ReturnType<typeof getInstitutions>>,
    );

    const result = await loadInstitutionOptions('query');

    expect(result).toEqual([]);
  });

  it('handles API errors gracefully', async () => {
    const error = new Error('API Error');
    mockGetInstitutions.mockRejectedValue(error);

    const result = await loadInstitutionOptions('query');

    expect(result).toEqual([]);
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(
      'Failed to load institutions:',
      error,
    );
  });

  it('filters out institutions with invalid names', async () => {
    const mockResponse = {
      items: [
        {
          names: [
            {
              value: 'Valid University',
              types: ['ror_display'],
              lang: 'en',
            },
          ],
        },
        {
          names: [],
        },
        {
          names: [
            {
              value: 'Another Valid',
              types: ['label'],
              lang: 'en',
            },
          ],
        },
      ],
    };

    mockGetInstitutions.mockResolvedValue(
      mockResponse as unknown as Awaited<ReturnType<typeof getInstitutions>>,
    );

    const result = await loadInstitutionOptions('test');

    expect(result).toEqual(['Valid University', 'Another Valid']);
  });

  it('handles multiple institutions with various name types', async () => {
    const mockResponse = {
      items: [
        {
          names: [
            {
              value: 'First University',
              types: ['ror_display'],
              lang: 'en',
            },
          ],
        },
        {
          names: [
            {
              value: 'Second University',
              types: ['label'],
              lang: 'en',
            },
          ],
        },
        {
          names: [
            {
              value: 'Third University',
              types: ['alias'],
              lang: 'en',
            },
          ],
        },
      ],
    };

    mockGetInstitutions.mockResolvedValue(
      mockResponse as unknown as Awaited<ReturnType<typeof getInstitutions>>,
    );

    const result = await loadInstitutionOptions('universities');

    expect(result).toEqual([
      'First University',
      'Second University',
      'Third University',
    ]);
  });
});
