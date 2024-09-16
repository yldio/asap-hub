import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';

import { Stringifier } from 'csv-stringify';

import { MAX_RESULTS, outputsResponseToStream, outputToCSV } from '../export';

beforeEach(jest.resetAllMocks);

describe('outputToCSV', () => {
  it('handles flat data', () => {
    const outputResponse: gp2Model.OutputResponse = {
      ...gp2Fixtures.createOutputResponse(),
      type: 'Blog',
      subtype: 'Preprints',
      link: 'https://google.com',
      tags: [{ id: 'tag-1', name: 'Neurology' }],
      workingGroups: [
        {
          title: 'WG-1',
          id: '1',
        },
      ],
      projects: [
        {
          id: '1',
          title: 'Project-1',
        },
      ],
      contributingCohorts: [{ id: '2', name: 'Cohort' }],
      relatedOutputs: [
        { title: 'output title', documentType: 'Article', id: '1' },
      ],
      relatedEvents: [
        { title: 'event title', id: '1', endDate: '2020-10-08T16:35:54Z' },
      ],
      publishDate: '2020-10-08T16:35:54Z',
      rrid: 'rrid',
      doi: 'doi',
      accessionNumber: '1234',
      versions: [
        {
          title: 'version title',
          id: 'version id',
          type: 'Blog',
          rrid: 'version rrid',
          link: 'version link',
          addedDate: 'added date',
          documentType: 'Article',
          accessionNumber: 'version accession',
        },
      ],
    };
    expect(outputToCSV(outputResponse)).toEqual({
      title: 'Output 1',
      documentType: 'Code/Software',
      type: 'Blog',
      subtype: 'Preprints',
      link: 'https://google.com',
      workingGroups: 'WG-1',
      projects: 'Project-1',
      contributingCohorts: 'Cohort',
      authors: expect.anything(),
      tags: 'Neurology',
      date: expect.anything(),
      description: 'An interesting article',
      shortDescription: 'An article',
      gp2Supported: 'Yes',
      lastUpdatedPartial: '2020-11-09T20:36:54Z',
      sharingStatus: 'GP2 Only',
      accession: '1234',
      doi: 'doi',
      firstVersionAccession: 'version accession',
      firstVersionLink: 'version link',
      firstVersionRRID: 'version rrid',
      firstVersionTitle: 'version title',
      firstVersionType: 'Blog',
      publishDate: '2020-10-08T16:35:54Z',
      relatedEvents: 'event title',
      relatedResearch: 'output title',
      rrid: 'rrid',
    });
  });

  it('flattens and order authors, add label to external authors', () => {
    const outputResponse: gp2Model.OutputResponse = {
      ...gp2Fixtures.createOutputResponse(),
      authors: [
        {
          id: '1',
          displayName: 'Albert',
        },
        {
          id: '2',
          firstName: 'Maria',
          lastName: 'Smith',
          email: 'maria@yld.com',
          displayName: 'Maria Smith',
        },
        {
          id: '1',
          displayName: 'John',
        },
      ],
    };
    const { authors } = outputToCSV(outputResponse);
    expect(authors).toMatchInlineSnapshot(`
      "Albert (external),
      John (external),
      Maria Smith"
    `);
  });

  it('flattens and order tags', () => {
    const outputResponse: gp2Model.OutputResponse = {
      ...gp2Fixtures.createOutputResponse(),
      tags: [
        {
          id: '1',
          name: 'Administrative Support',
        },
        {
          id: '2',
          name: 'GP2',
        },
        {
          id: '1',
          name: 'Cohort',
        },
      ],
    };
    const { tags } = outputToCSV(outputResponse);
    expect(tags).toMatchInlineSnapshot(`
      "Administrative Support,
      Cohort,
      GP2"
    `);
  });

  it('formats the date', () => {
    const outputResponse: gp2Model.OutputResponse = {
      ...gp2Fixtures.createOutputResponse(),
      addedDate: '2021-12-28T14:00:00.000Z',
    };
    const { date } = outputToCSV(outputResponse);
    expect(date).toEqual('28th December 2021');
  });
});

describe('usersResponseToStream', () => {
  const mockCsvStream = {
    write: jest.fn(),
    end: jest.fn(),
  };

  it('streams one page of results', async () => {
    const outputsResponse = gp2Fixtures.createListOutputResponse();
    await outputsResponseToStream(
      mockCsvStream as unknown as Stringifier,
      jest.fn().mockResolvedValue(outputsResponse),
      jest.fn((x) => ({ ...x })),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      gp2Fixtures.createOutputResponse(),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(1);
    expect(mockCsvStream.end).toHaveBeenCalledTimes(1);
  });

  it('streams multiple pages of results', async () => {
    await outputsResponseToStream(
      mockCsvStream as unknown as Stringifier,
      jest.fn().mockResolvedValue({
        ...gp2Fixtures.createListOutputResponse(),
        total: MAX_RESULTS + 1,
      }),
      jest.fn((x) => ({ ...x })),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      gp2Fixtures.createOutputResponse(0),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      gp2Fixtures.createOutputResponse(0),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(2);
    expect(mockCsvStream.end).toHaveBeenCalledTimes(1);
  });

  it('streams transformed results', async () => {
    await outputsResponseToStream(
      mockCsvStream as unknown as Stringifier,
      jest.fn().mockResolvedValue(gp2Fixtures.createListOutputResponse()),
      jest.fn(({ documentType }: gp2Model.OutputResponse) => ({
        type: documentType,
      })),
    );
    expect(mockCsvStream.write).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'Code/Software',
      }),
    );
    expect(mockCsvStream.write).toHaveBeenCalledTimes(1);
  });
});
