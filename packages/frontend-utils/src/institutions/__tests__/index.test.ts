import {
  extractInstitutionDisplayName,
  transformRorInstitutionsToNames,
  loadInstitutionOptions,
  type RorInstitutionName,
  type RorApiResponse,
} from '../index';

// Mock fetch globally
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

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
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads and transforms institutions successfully', async () => {
    const mockResponse = {
      number_of_results: 1,
      time_taken: 0,
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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await loadInstitutionOptions('test');

    expect(result).toEqual(['Test University']);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.ror.org/v2/organizations?query=test',
    );
  });

  it('handles empty search query', async () => {
    const mockResponse = {
      number_of_results: 1,
      time_taken: 0,
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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await loadInstitutionOptions();

    expect(result).toEqual(['Default University']);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.ror.org/v2/organizations',
    );
  });

  it('returns empty array when API returns empty items', async () => {
    const mockResponse = {
      number_of_results: 0,
      time_taken: 0,
      items: [],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await loadInstitutionOptions('query');

    expect(result).toEqual([]);
  });

  it('returns empty array when API returns no items property', async () => {
    const mockResponse = {
      number_of_results: 0,
      time_taken: 0,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await loadInstitutionOptions('query');

    expect(result).toEqual([]);
  });

  it('handles API errors gracefully', async () => {
    const error = new Error('API Error');
    mockFetch.mockRejectedValueOnce(error);

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
      number_of_results: 3,
      time_taken: 0,
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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await loadInstitutionOptions('test');

    expect(result).toEqual(['Valid University', 'Another Valid']);
  });

  it('handles multiple institutions with various name types', async () => {
    const mockResponse = {
      number_of_results: 3,
      time_taken: 0,
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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await loadInstitutionOptions('universities');

    expect(result).toEqual([
      'First University',
      'Second University',
      'Third University',
    ]);
  });
});
