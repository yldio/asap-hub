import {
  createResearchOutputResponse,
  createTeamResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { ResearchOutputResponse } from '@asap-hub/model';
import { CsvFormatterStream, Row } from '@fast-csv/format';
import { waitFor } from '@testing-library/dom';
import streamSaver from 'streamsaver';

import { createAlgoliaResponse } from '../../__fixtures__/algolia';
import {
  researchOutputToCSV,
  createCsvFileStream,
  algoliaResultsToStream,
  EXCEL_CELL_CHARACTER_LIMIT,
} from '../export';

const mockWriteStream = { write: jest.fn(), close: jest.fn() };
jest.mock('streamsaver', () => ({
  createWriteStream: jest.fn(() => ({
    getWriter: jest.fn(() => mockWriteStream),
  })),
}));

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
      type: 'Presentation',
      accessInstructions: 'accessInstructions',
      accession: 'accession',
      addedDate: 'addedDate',
      asapFunded: false,
      doi: 'doi',
      labCatalogNumber: 'labCatalogNumber',
      lastModifiedDate: 'lastModifiedDate',
      link: 'link',
      publishDate: 'publishDate',
      rrid: 'rrid',
      subTypes: ['3D Printing', 'ASAP annual meeting'],
      usedInPublication: false,
    };
    expect(researchOutputToCSV(output)).toEqual({
      created: 'created',
      description: 'description',
      id: 'id',
      lastUpdatedPartial: 'lastUpdatedPartial',
      sharingStatus: 'Network Only',
      title: 'title,',
      type: 'Presentation',
      accessInstructions: 'accessInstructions',
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
      subTypes: '3D Printing,ASAP annual meeting',
      authors: expect.anything(),
      labs: expect.anything(),
      tags: expect.anything(),
      teams: expect.anything(),
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
          displayName: 'b Internal 1',
          orcid: 'Orcid 2',
        },
        {
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

  it('Removes HTML from RTF fields', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      description: '<a>example</a> <p>123</p>',
      accessInstructions: '<a>example</a> <p>123</p>',
    };
    expect(researchOutputToCSV(output).description).toMatchInlineSnapshot(
      `"example 123"`,
    );
    expect(
      researchOutputToCSV(output).accessInstructions,
    ).toMatchInlineSnapshot(`"example 123"`);
  });
});

describe('createCsvFileStream', () => {
  it('Creates a CSV file write stream, writes headers and ordered data, closes saver stream when csv stream closed', async () => {
    const csvStream = createCsvFileStream(
      { headers: ['a', 'b'] },
      'example.csv',
    );
    expect(streamSaver.createWriteStream).toHaveBeenCalledWith('example.csv');

    csvStream.write({
      b: 'test2',
      a: 'test',
    });

    expect(mockWriteStream.write.mock.calls[1].toString()).toEqual('a,b');
    expect(mockWriteStream.write.mock.calls[2].toString()).toMatch(
      /test,test2/,
    );

    csvStream.end();
    await waitFor(() => expect(mockWriteStream.close).toHaveBeenCalled());
  });

  it('Limits RTF fields to maximum safe excel cell character limit after escaping', async () => {
    const csvStream = createCsvFileStream(undefined, 'example.csv');
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      description: '"'.repeat(EXCEL_CELL_CHARACTER_LIMIT * 2),
      accessInstructions: '"'.repeat(EXCEL_CELL_CHARACTER_LIMIT * 2),
    };
    const { accessInstructions, description } = researchOutputToCSV(output);
    csvStream.write({
      a: accessInstructions,
    });
    csvStream.write({
      a: description,
    });
    csvStream.end();
    expect(
      mockWriteStream.write.mock.calls[1][0].toString().length,
    ).toBeLessThanOrEqual(EXCEL_CELL_CHARACTER_LIMIT);
    expect(
      mockWriteStream.write.mock.calls[2][0].toString().length,
    ).toBeLessThanOrEqual(EXCEL_CELL_CHARACTER_LIMIT);
  });
});

describe('algoliaResultsToStream', () => {
  const mockCsvStream = {
    write: jest.fn(),
    end: jest.fn(),
  };
  it('streams one page of results', async () => {
    await algoliaResultsToStream(
      mockCsvStream as unknown as CsvFormatterStream<Row, Row>,
      () =>
        Promise.resolve(
          createAlgoliaResponse(
            'research-output',
            [createResearchOutputResponse()],
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
      mockCsvStream as unknown as CsvFormatterStream<Row, Row>,
      (parameters) =>
        Promise.resolve(
          createAlgoliaResponse(
            'research-output',
            [
              {
                ...createResearchOutputResponse(),
                title: `${parameters.currentPage}`,
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
      mockCsvStream as unknown as CsvFormatterStream<Row, Row>,
      () =>
        Promise.resolve(
          createAlgoliaResponse(
            'research-output',
            [{ ...createResearchOutputResponse(), title: 'a' }],
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
