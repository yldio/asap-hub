import { createWorkspaceManuscript } from '@asap-hub/fixtures';
import {
  ComplianceReportPostRequest,
  ManuscriptPostRequest,
} from '@asap-hub/model';
import nock from 'nock';

import { API_BASE_URL } from '../../config';
import {
  createComplianceReport,
  createManuscript,
  getWorkspaceManuscripts,
  resubmitManuscript,
  uploadManuscriptFileViaPresignedUrl,
} from '../api';

jest.mock('../../config', () => ({
  API_BASE_URL: 'http://api',
}));

afterEach(() => {
  nock.cleanAll();
});

describe('createManuscript', () => {
  const payload: ManuscriptPostRequest = {
    title: 'The Manuscript',
    teamId: '42',
    eligibilityReasons: [],
    impact: 'impact-id-1',
    categories: ['category-id-1'],
    versions: [
      {
        lifecycle: 'Publication',
        type: 'Original Research',
        manuscriptFile: {
          id: '42',
          filename: 'test-file',
          url: 'https://example.com/test-file',
        },
        teams: ['42'],
        labs: [],
        description: '',
        shortDescription: '',
        firstAuthors: [],
      },
    ],
  };

  it('makes an authorized POST request to create a manuscript', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post('/manuscripts', payload)
      .reply(201, { id: 123 });

    await createManuscript(payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('errors for an error status', async () => {
    nock(API_BASE_URL).post('/manuscripts').reply(500, {});

    await expect(
      createManuscript(payload, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to create manuscript. Expected status 201. Received status 500."`,
    );
  });
});

describe('resubmitManuscript', () => {
  const payload: ManuscriptPostRequest = {
    title: 'The Manuscript',
    teamId: '42',
    impact: 'impact-id-1',
    categories: ['category-id-1'],
    versions: [
      {
        lifecycle: 'Publication',
        type: 'Original Research',
        manuscriptFile: {
          id: '42',
          filename: 'test-file',
          url: 'https://example.com/test-file',
        },
        teams: ['42'],
        labs: [],
        description: '',
        shortDescription: '',
        firstAuthors: [],
      },
    ],
  };
  const manuscriptId = 'manuscript-id-1';

  it('makes an authorized POST request to resubmit a manuscript', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post(`/manuscripts/${manuscriptId}`, payload)
      .reply(201, { id: manuscriptId });

    await resubmitManuscript(manuscriptId, payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('errors for an error status', async () => {
    nock(API_BASE_URL).post(`/manuscripts/${manuscriptId}`).reply(500, {});

    await expect(
      resubmitManuscript(manuscriptId, payload, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to resubmit manuscript with id manuscript-id-1. Expected status 201. Received status 500."`,
    );
  });
});

describe('getWorkspaceManuscripts', () => {
  it('makes an authorized GET request with the teamId query param', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/manuscripts')
      .query({ teamId: '42' })
      .reply(200, { manuscripts: [], collaborationManuscripts: [] });

    await getWorkspaceManuscripts({ teamId: '42' }, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('makes a GET request with the projectId query param', async () => {
    nock(API_BASE_URL)
      .get('/manuscripts')
      .query({ projectId: 'project-1' })
      .reply(200, { manuscripts: [], collaborationManuscripts: [] });

    await getWorkspaceManuscripts({ projectId: 'project-1' }, '');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched workspace manuscripts', async () => {
    const response = {
      manuscripts: [createWorkspaceManuscript()],
      collaborationManuscripts: [createWorkspaceManuscript(1)],
    };
    nock(API_BASE_URL)
      .get('/manuscripts')
      .query({ teamId: '42' })
      .reply(200, response);

    expect(await getWorkspaceManuscripts({ teamId: '42' }, '')).toEqual(
      response,
    );
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/manuscripts').query({ teamId: '42' }).reply(500);

    await expect(
      getWorkspaceManuscripts({ teamId: '42' }, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch workspace manuscripts. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('createComplianceReport', () => {
  const payload: ComplianceReportPostRequest = {
    manuscriptId: 'manuscript-1',
    url: 'https://compliancereport.com',
    description: 'Compliance report description',
    manuscriptVersionId: 'manuscript-version-1',
    status: 'Review Compliance Report',
  };

  it('makes an authorized POST request to create a compliance report', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post('/compliance-reports', payload)
      .reply(201, { id: 123 });

    await createComplianceReport(payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('errors for an error status', async () => {
    nock(API_BASE_URL).post('/compliance-reports').reply(500, {});

    await expect(
      createComplianceReport(payload, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to create compliance report. Expected status 201. Received status 500."`,
    );
  });
});

describe('uploadManuscriptFileViaPresignedUrl', () => {
  const file = new File(['file content'], 'test-file.pdf', {
    type: 'application/pdf',
  });

  const authorization = 'Bearer token';

  const mockPresignedUrl =
    'https://bucket-name.s3.amazonaws.com/test-file.pdf?signature=abc';
  const mockResponse = {
    id: 'file-123',
    filename: 'test-file.pdf',
    url: 'https://bucket-name.s3.amazonaws.com/test-file.pdf',
  };

  afterEach(() => {
    nock.cleanAll();
  });

  it('calls S3 and file-upload-from-url endpoint with correct payloads when uploading via presigned URL', async () => {
    const handleError = jest.fn();

    // Capture request bodies
    const presignedUrlRequestBody: Record<string, unknown>[] = [];
    const uploadFromUrlRequestBody: Record<string, unknown>[] = [];

    let s3UploadRequestBodyRaw: unknown;

    // 1. Mock presigned URL generation
    const presignedUrlScope = nock('http://api')
      .post('/files/get-url', (body) => {
        presignedUrlRequestBody.push(body);
        return true;
      })
      .reply(200, { presignedUrl: mockPresignedUrl });

    // 2. Mock S3 file upload
    const s3UploadScope = nock('https://bucket-name.s3.amazonaws.com')
      .put('/test-file.pdf')
      .query(true)
      .reply(200, (_, requestBody) => {
        s3UploadRequestBodyRaw = requestBody;
        return {};
      });

    // 3. Mock backend file registration
    const backendScope = nock('http://api')
      .post('/manuscripts/file-upload-from-url', (body) => {
        uploadFromUrlRequestBody.push(body);
        return true;
      })
      .reply(200, mockResponse);

    // 4. Trigger the actual function
    await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    // 5. Assert presigned URL request payload
    expect(presignedUrlRequestBody[0]).toEqual({
      action: 'upload',
      filename: 'test-file.pdf',
      contentType: 'application/pdf',
    });

    // 6. Assert file-upload-from-url payload
    expect(uploadFromUrlRequestBody[0]).toEqual({
      filename: 'test-file.pdf',
      fileType: 'Manuscript File',
      contentType: 'application/pdf',
      url: mockResponse.url,
    });

    // 7. Assert actual file content sent to S3
    expect(s3UploadRequestBodyRaw).toBe('[object File]');

    // 8. Assert all mocks were called
    expect(presignedUrlScope.isDone()).toBe(true);
    expect(s3UploadScope.isDone()).toBe(true);
    expect(backendScope.isDone()).toBe(true);

    // 9. Assert no error handler was triggered
    expect(handleError).not.toHaveBeenCalled();
  });

  it('handles 400 validation errors from asset creation', async () => {
    const handleError = jest.fn();

    nock('http://api')
      .post('/files/get-url')
      .reply(200, { presignedUrl: mockPresignedUrl });

    nock('https://bucket-name.s3.amazonaws.com')
      .put('/test-file.pdf')
      .query(true)
      .reply(200);

    nock('http://api')
      .post('/manuscripts/file-upload-from-url')
      .reply(400, { message: 'Validation failed' });

    const result = await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    expect(handleError).toHaveBeenCalledWith('Validation failed');
    expect(result).toBeUndefined();
  });

  it('handles unexpected S3 upload failure', async () => {
    const handleError = jest.fn();

    nock('http://api')
      .post('/files/get-url')
      .reply(200, { presignedUrl: mockPresignedUrl });

    nock('https://bucket-name.s3.amazonaws.com')
      .put('/test-file.pdf')
      .query(true)
      .reply(500, 'S3 Error');

    const result = await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    expect(handleError).toHaveBeenCalledWith(
      expect.stringContaining('S3 upload failed'),
    );
    expect(result).toBeUndefined();
  });

  it('throws and calls handleError on unexpected error from backend after S3 upload', async () => {
    const handleError = jest.fn();

    nock('http://api')
      .post('/files/get-url')
      .reply(200, { presignedUrl: mockPresignedUrl });

    nock('https://bucket-name.s3.amazonaws.com')
      .put('/test-file.pdf')
      .query(true)
      .reply(200);

    nock('http://api')
      .post('/manuscripts/file-upload-from-url')
      .reply(500, { error: 'Server Error' });

    const result = await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    expect(handleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed to upload manuscript file via presigned URL',
      ),
    );
    expect(result).toBeUndefined();
  });

  it('handles general error', async () => {
    const handleError = jest.fn();

    nock('http://api').post('/files/get-url').replyWithError('Boom');

    const result = await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    expect(handleError).toHaveBeenCalledWith(
      'request to http://api/files/get-url failed, reason: Boom',
    );
    expect(result).toBeUndefined();
  });

  it('calls handleError with fallback message if non-Error is thrown', async () => {
    const handleError = jest.fn();

    nock('http://api')
      .post('/files/get-url')
      .reply(200, { presignedUrl: mockPresignedUrl });

    const originalFetch = global.fetch;
    global.fetch = jest.fn(() => {
      // eslint-disable-next-line no-throw-literal
      throw 'NonErrorString';
    });

    const result = await uploadManuscriptFileViaPresignedUrl(
      file,
      'Manuscript File',
      authorization,
      handleError,
    );

    expect(handleError).toHaveBeenCalledWith(
      'Unexpected error during file upload',
    );
    expect(result).toBeUndefined();

    global.fetch = originalFetch; // Restore the original fetch after the test
  });
});
