import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { createOutput, getOutput, getOutputs } from '../api';

jest.mock('../../config');

describe('getOutput', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched output by id', async () => {
    const outputResponse = gp2Fixtures.createOutputResponse();
    const { id } = outputResponse;
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/outputs/${id}`)
      .reply(200, outputResponse);
    const result = await getOutput(id, 'Bearer x');
    expect(result).toEqual(outputResponse);
  });

  it('returns undefined if server returns 404', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/outputs/unknown-id`)
      .reply(404);
    const result = await getOutput('unknown-id', 'Bearer x');
    expect(result).toBeUndefined();
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/outputs/unknown-id`)
      .reply(500);

    await expect(
      getOutput('unknown-id', 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch output with id unknown-id. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('getOutputs', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });
  const options: gp2Model.FetchOutputOptions = {
    search: '',
  };

  it('returns a successfully fetched outputs', async () => {
    const outputsResponse: gp2Model.ListOutputResponse =
      gp2Fixtures.createListOutputResponse(1);
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/outputs')
      .reply(200, outputsResponse);

    const result = await getOutputs('Bearer x', options);
    expect(result).toEqual(outputsResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/outputs')
      .reply(500);

    await expect(
      getOutputs('Bearer x', options),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the Outputs. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('createOutput', () => {
  const payload = { title: 'output title', documentType: 'Form' as const };
  it('makes an authorized POST request to create a research output', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post('/outputs', payload)
      .reply(201, { id: 123 });

    await createOutput(payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });
  it('errors for an error status', async () => {
    nock(API_BASE_URL).post('/outputs').reply(500, {});

    await expect(
      createOutput(payload, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to create output. Expected status 201. Received status 500."`,
    );
  });
});
