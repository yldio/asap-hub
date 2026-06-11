import { ResearchOutputResponse } from '@asap-hub/model';
import { RESEARCH_OUTPUT_ENTITY_TYPE } from '../src';
import {
  NoTokenAlgoliaClient,
  EMPTY_ALGOLIA_FACET_HITS,
  EMPTY_ALGOLIA_RESPONSE,
} from '../src/no-token-client';

describe('NoTokenAlgoliaClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createClient = () =>
    new NoTokenAlgoliaClient<'crn'>('index', 'reverseIndex');

  test('should throw error on save', async () => {
    const client = createClient();
    await expect(
      client.save({
        data: {
          id: `ro-id-1`,
          title: 'ro-title',
        } as ResearchOutputResponse,
        type: 'research-output',
      }),
    ).rejects.toThrow('Saving is not allowed for this client');
  });

  test('should throw error on saveMany', async () => {
    const client = createClient();
    await expect(
      client.saveMany([
        {
          data: {
            id: `ro-id-1`,
            title: 'ro-title',
          } as ResearchOutputResponse,
          type: 'research-output',
        },
      ]),
    ).rejects.toThrow('Saving many is not allowed for this client');
  });

  test('should throw error on remove', async () => {
    const client = createClient();
    await expect(client.remove('some-id')).rejects.toThrow(
      'Removing is not allowed for this client',
    );
  });

  test('should return EMPTY_ALGOLIA_RESPONSE on search', async () => {
    const client = createClient();
    const result = await client.search(
      [RESEARCH_OUTPUT_ENTITY_TYPE],
      'some-query',
    );
    expect(result).toEqual(EMPTY_ALGOLIA_RESPONSE);
  });

  test('should return EMPTY_ALGOLIA_FACET_HITS on tag search', async () => {
    const client = createClient();
    const result = await client.searchForTagValues(
      [RESEARCH_OUTPUT_ENTITY_TYPE],
      'some-query',
    );
    expect(result).toEqual(EMPTY_ALGOLIA_FACET_HITS);
  });
});
