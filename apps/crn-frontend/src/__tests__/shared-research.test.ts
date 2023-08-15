import { AlgoliaSearchClient } from '@asap-hub/algolia';
import { OutputDocumentTypeParameter } from '@asap-hub/routing';
import { ResearchOutputDocumentType } from '@asap-hub/model';
import { useAlgolia } from '../hooks/algolia';
import {
  paramOutputDocumentTypeToResearchOutputDocumentType,
  useRelatedResearchSuggestions,
} from '../shared-research';

const mockAlgoliaClient = {
  search: jest.fn(),
};

jest.mock('../hooks/algolia', () => ({
  useAlgolia: jest.fn(),
}));

it.each<{
  param: Parameters<
    typeof paramOutputDocumentTypeToResearchOutputDocumentType
  >[0];
  outputType: ResearchOutputDocumentType;
}>([
  { param: 'article', outputType: 'Article' },
  { param: 'bioinformatics', outputType: 'Bioinformatics' },
  { param: 'dataset', outputType: 'Dataset' },
  { param: 'lab-resource', outputType: 'Lab Resource' },
  { param: 'protocol', outputType: 'Protocol' },
  { param: 'protocol', outputType: 'Protocol' },
  { param: 'report', outputType: 'Report' },
  {
    param: 'unknown' as OutputDocumentTypeParameter,
    outputType: 'Article',
  },
])('maps from $param to $outputType', ({ param, outputType }) => {
  expect(paramOutputDocumentTypeToResearchOutputDocumentType(param)).toEqual(
    outputType,
  );
});

describe('useRelatedResearchSuggestions', () => {
  beforeEach(() => {
    const mockUseAlgolia = useAlgolia as jest.MockedFunction<typeof useAlgolia>;
    mockUseAlgolia.mockReturnValue({
      client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'crn'>,
    });
    mockAlgoliaClient.search.mockResolvedValue({
      hits: [
        {
          id: 'output-1',
          title: 'Title 1',
          type: 'Type',
          documentType: 'Document Type',
        },
        {
          id: 'output-2',
          title: 'Title 2',
          type: 'Type',
          documentType: 'Document Type',
        },
      ],
    });
  });

  it('performs an algolia search for research outputs', async () => {
    const getSuggestions = useRelatedResearchSuggestions();
    await getSuggestions('');

    expect(mockAlgoliaClient.search).toHaveBeenCalledWith(
      ['research-output'],
      '',
      expect.anything(),
    );
  });

  it('maps algolia search result to { label, value, type, documentType }', async () => {
    const getSuggestions = useRelatedResearchSuggestions();
    const result = await getSuggestions('');

    expect(result).toEqual([
      {
        value: 'output-1',
        label: 'Title 1',
        type: 'Type',
        documentType: 'Document Type',
      },
      {
        value: 'output-2',
        label: 'Title 2',
        type: 'Type',
        documentType: 'Document Type',
      },
    ]);
  });

  it('removes the current id from the results if provided', async () => {
    const getSuggestions = useRelatedResearchSuggestions('output-1');
    const result = await getSuggestions('');

    expect(result).toEqual([
      {
        value: 'output-2',
        label: 'Title 2',
        type: 'Type',
        documentType: 'Document Type',
      },
    ]);
  });
});
