import {
  createResearchOutputResponse,
  createTeamResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { ResearchOutputResponse } from '@asap-hub/model';
import { waitFor } from '@testing-library/dom';
import streamSaver from 'streamsaver';

import { researchOutputToCSV, createCsvFileStream } from '../export';

const mockWriteStream = { write: jest.fn(), close: jest.fn() };
jest.mock('streamsaver', () => ({
  createWriteStream: jest.fn(() => ({
    getWriter: jest.fn(() => mockWriteStream),
  })),
}));

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
      pmsEmails: '',
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
  it('flattens and orders pm emails', () => {
    const output: ResearchOutputResponse = {
      ...createResearchOutputResponse(),
      pmsEmails: [
        'ztest@example.com',
        'ctest@example.com',
        'atest@example.com',
      ],
    };
    expect(researchOutputToCSV(output).pmsEmails).toMatchInlineSnapshot(
      `"atest@example.com,ctest@example.com,ztest@example.com"`,
    );
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

    expect(mockWriteStream.write.mock.calls[0].toString()).toEqual('a,b');
    expect(mockWriteStream.write.mock.calls[1].toString()).toMatch(
      /test,test2/,
    );

    csvStream.end();
    await waitFor(() => expect(mockWriteStream.close).toHaveBeenCalled());
  });
});
