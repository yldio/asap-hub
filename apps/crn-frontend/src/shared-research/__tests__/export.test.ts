import {
  createResearchOutputResponse,
  createTeamResponse,
  createUserResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import { ResearchOutputResponse } from '@asap-hub/model';
import { Stringifier } from 'csv-stringify';

import { createAlgoliaResponse } from '../../__fixtures__/algolia';
import { researchOutputToCSV, algoliaResultsToStream } from '../export';

afterEach(() => {
  jest.clearAllMocks();
});
describe('researchOutputToCSV', () => {
  it('handles flat data', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
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
      publishDate: 'publishDate',
      rrid: 'rrid',
      type: '3D Printing',
      usedInPublication: false,
      methods: ['Activity Assay', 'RNA Single Cell'],
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
      tags: expect.anything(),
      teams: expect.anything(),
      workingGroups: expect.anything(),
      relatedResearch: '',
      methods: 'Activity Assay,RNA Single Cell',
      organisms: 'C. Elegans,Rat',
      environments: 'In Cellulo,In Vivo',
      subtype: 'Metabolite',
      published: true,
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
  it('flattens and orders tags', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      tags: ['a', 'z', 'c'],
    };
    expect(researchOutputToCSV(output).tags).toMatchInlineSnapshot(`"a,c,z"`);
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
      relatedResearch: [
        { ...createResearchOutputResponse(), title: 't1' },
        { ...createResearchOutputResponse(), title: 't2' },
        { ...createResearchOutputResponse(), title: 't3' },
      ],
    };
    expect(researchOutputToCSV(output).relatedResearch).toMatchInlineSnapshot(
      `"t1,t2,t3"`,
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
                __meta: { type: 'research-output' },
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
          createAlgoliaResponse(
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
