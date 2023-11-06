import {
  createResearchOutputResponse,
  createTeamResponse,
  createUserResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { Stringifier } from 'csv-stringify';

import { createAlgoliaResponse } from '../../__fixtures__/algolia';
import {
  algoliaResultsToStream,
  MAX_SQUIDEX_RESULTS,
  researchOutputToCSV,
  squidexResultsToStream,
} from '../export';

afterEach(() => {
  jest.clearAllMocks();
});
describe('researchOutputToCSV', () => {
  it('handles flat data', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      created: 'created',
      description: 'description',
      descriptionMD: '',
      id: 'id',
      lastUpdatedPartial: 'lastUpdatedPartial',
      sharingStatus: 'Network Only',
      title: 'title,',
      documentType: 'Presentation',
      usageNotes: 'usageNotes',
      accession: 'accession',
      addedDate: 'addedDate',
      asapFunded: false,
      doi: 'doi',
      labCatalogNumber: 'labCatalogNumber',
      lastModifiedDate: 'lastModifiedDate',
      link: 'link',
      publishDate: 'publishDate',
      rrid: 'rrid',
      type: '3D Printing',
      usedInPublication: false,
      methods: ['Activity Assay', 'RNA Single Cell'],
      keywords: ['Keyword1', 'Keyword2'],
      statusChangedBy: { id: 'user-id', firstName: 'John', lastName: 'Doe' },
      isInReview: true,
    };
    expect(researchOutputToCSV(output)).toEqual({
      created: 'created',
      description: 'description',
      id: 'id',
      lastUpdatedPartial: 'lastUpdatedPartial',
      sharingStatus: 'Network Only',
      title: 'title,',
      documentType: 'Presentation',
      usageNotes: 'usageNotes',
      accession: 'accession',
      addedDate: 'addedDate',
      asapFunded: false,
      doi: 'doi',
      labCatalogNumber: 'labCatalogNumber',
      lastModifiedDate: 'lastModifiedDate',
      link: 'link',
      contactEmails: '',
      publishDate: 'publishDate',
      rrid: 'rrid',
      usedInPublication: false,
      type: '3D Printing',
      authors: expect.anything(),
      labs: expect.anything(),
      teams: expect.anything(),
      workingGroups: expect.anything(),
      relatedResearch: '',
      relatedEvents: 'Example Event',
      methods: 'Activity Assay,RNA Single Cell',
      keywords: 'Keyword1,Keyword2',
      organisms: 'C. Elegans,Rat',
      environments: 'In Cellulo,In Vivo',
      subtype: 'Metabolite',
      published: true,
      statusChangedBy: 'John Doe',
      isInReview: true,
      publishingEntity: 'Working Group',
    });
  });
  it('flattens authors, preserves order, displays orcid and external status when available', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      authors: [
        {
          ...createUserResponse(),
          displayName: 'z Internal 1',
          orcid: 'Orcid 1',
        },
        {
          ...createUserResponse(),
          displayName: 'a Internal 2',
          orcid: undefined,
        },
        {
          id: 'external-author-1',
          displayName: 'b Internal 1',
          orcid: 'Orcid 2',
        },
        {
          id: 'external-author-2',
          displayName: 'b Internal 2',
          orcid: undefined,
        },
      ],
    };
    expect(researchOutputToCSV(output).authors).toMatchInlineSnapshot(
      `"z Internal 1 (Orcid 1),a Internal 2,b Internal 1 (Orcid 2) [ext],b Internal 2 [ext]"`,
    );
  });
  it('flattens and orders labs', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      labs: [
        { name: 'z', id: '123' },
        { name: 'b', id: '123' },
        { name: 'a', id: '123' },
      ],
    };
    expect(researchOutputToCSV(output).labs).toMatchInlineSnapshot(`"a,b,z"`);
  });
  it('flattens and orders keywords', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      keywords: ['a', 'z', 'c'],
    };
    expect(researchOutputToCSV(output).keywords).toMatchInlineSnapshot(
      `"a,c,z"`,
    );
  });
  it('flattens and orders teams', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      teams: [
        { ...createTeamResponse({}), displayName: 'z' },
        { ...createTeamResponse({}), displayName: 'b' },
        { ...createTeamResponse({}), displayName: '1' },
      ],
    };
    expect(researchOutputToCSV(output).teams).toMatchInlineSnapshot(`"1,b,z"`);
  });
  it('handles working groups', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      workingGroups: [{ ...createWorkingGroupResponse({}), title: 'wg' }],
    };
    expect(researchOutputToCSV(output).workingGroups).toMatchInlineSnapshot(
      `"wg"`,
    );
    expect(
      researchOutputToCSV({ ...output, workingGroups: undefined })
        .workingGroups,
    ).toMatchInlineSnapshot(`""`);
  });
  it('flattens and orders contact emails', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      contactEmails: [
        'ztest@example.com',
        'ctest@example.com',
        'atest@example.com',
      ],
    };
    expect(researchOutputToCSV(output).contactEmails).toMatchInlineSnapshot(
      `"atest@example.com,ctest@example.com,ztest@example.com"`,
    );
  });
  it('flattens and orders related research', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      relatedResearch: Array.from({ length: 3 }, (_, i) => ({
        id: `t${i}`,
        title: `t${i}`,
        documentType: 'Grant Document',
        type: '3D Printing',
        teams: [{ id: 'team-id-1', displayName: 'Team B' }],
        workingGroups: [],
      })),
    };
    expect(researchOutputToCSV(output).relatedResearch).toMatchInlineSnapshot(
      `"t0,t1,t2"`,
    );
    const outputWithoutRelatedResearch = {
      ...output,
      relatedResearch: [],
    };
    expect(
      researchOutputToCSV(outputWithoutRelatedResearch).relatedResearch,
    ).toMatchInlineSnapshot('""');
  });

  it('Removes HTML from RTF fields', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      descriptionMD: '',
      description: '<a>example</a> <p>123</p>',
      usageNotes: '<a>example</a> <p>123</p>',
    };
    expect(researchOutputToCSV(output).description).toMatchInlineSnapshot(
      `"example 123"`,
    );
    expect(researchOutputToCSV(output).usageNotes).toMatchInlineSnapshot(
      `"example 123"`,
    );
  });
});

describe('squidexResultsToStream', () => {
  const mockCsvStream = {
    write: jest.fn(),
    end: jest.fn(),
  };
  it('streams one page of results', async () => {
    await squidexResultsToStream(
      mockCsvStream as unknown as Stringifier,
      () =>
        Promise.resolve<ListResearchOutputResponse>({
          items: [createResearchOutputResponse()],
          total: 1,
        }),
      (a) => a,
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining(createResearchOutputResponse()),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(1);
    expect(mockCsvStream.end).toHaveBeenCalledTimes(1);
  });

  it('streams multiple pages of results', async () => {
    await squidexResultsToStream(
      mockCsvStream as unknown as Stringifier,
      (parameters) =>
        Promise.resolve<ListResearchOutputResponse>({
          items: [
            {
              ...createResearchOutputResponse(),
              title: `${parameters.currentPage}`,
            },
          ],
          total: 3 * MAX_SQUIDEX_RESULTS,
        }),
      (a) => a,
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '0',
      }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '1',
      }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '2',
      }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(3);
    expect(mockCsvStream.end).toHaveBeenCalledTimes(1);
  });

  it('streams transformed results', async () => {
    await squidexResultsToStream(
      mockCsvStream as unknown as Stringifier,
      () =>
        Promise.resolve<ListResearchOutputResponse>({
          items: [
            {
              ...createResearchOutputResponse(),
              title: 'a',
            },
          ],
          total: 2 * MAX_SQUIDEX_RESULTS,
        }),
      (a: ResearchOutputResponse) => ({ title: `${a.title}-b` }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'a-b',
      }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(2);
  });
});

describe('algoliaResultsToStream', () => {
  const mockCsvStream = {
    write: jest.fn(),
    end: jest.fn(),
  };
  it('streams one page of results', async () => {
    await algoliaResultsToStream(
      mockCsvStream as unknown as Stringifier,
      () =>
        Promise.resolve(
          createAlgoliaResponse(
            [
              {
                ...createResearchOutputResponse(),
                objectID: 'ro-1',
                __meta: {
                  type: 'research-output',
                },
              },
            ],
            {
              nbPages: 1,
            },
          ),
        ),
      (a) => a,
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining(createResearchOutputResponse()),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(1);
    expect(mockCsvStream.end).toHaveBeenCalledTimes(1);
  });

  it('streams multiple pages of results', async () => {
    await algoliaResultsToStream(
      mockCsvStream as unknown as Stringifier,
      (parameters) =>
        Promise.resolve(
          createAlgoliaResponse(
            [
              {
                ...createResearchOutputResponse(),
                title: `${parameters.currentPage}`,
                objectID: 'ro-1',
                __meta: { type: 'research-output' },
              },
            ],
            {
              nbPages: 3,
            },
          ),
        ),
      (a) => a,
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining({
        ...createResearchOutputResponse(),
        title: '0',
      }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining({
        ...createResearchOutputResponse(),
        title: '1',
      }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining({
        ...createResearchOutputResponse(),
        title: '2',
      }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(3);
    expect(mockCsvStream.end).toHaveBeenCalledTimes(1);
  });

  it('streams transformed results', async () => {
    await algoliaResultsToStream(
      mockCsvStream as unknown as Stringifier,
      () =>
        Promise.resolve(
          createAlgoliaResponse<'research-output'>(
            [
              {
                ...createResearchOutputResponse(),
                title: 'a',
                objectID: 'ro-1',
                __meta: { type: 'research-output' },
              },
            ],
            {
              nbPages: 2,
            },
          ),
        ),
      (a: ResearchOutputResponse) => ({ title: `${a.title}-b` }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'a-b',
      }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(2);
  });
});
