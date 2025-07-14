import { BackendError, createSentryHeaders } from '@asap-hub/frontend-utils';
import { FileAction } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const getPresignedUrl = async (
  filename: string,
  authorization: string,
  contentType?: string,
  action: FileAction = 'upload',
): Promise<{ presignedUrl: string }> => {
  const resp = await fetch(`${API_BASE_URL}/files/get-url`, {
    method: 'POST',
    headers: {
      authorization,
      'Content-Type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify({ filename, action, contentType }),
  });

  let response;
  try {
    response = await resp.json();
  } catch (error) {
    throw new BackendError(
      `Failed to parse JSON response when generating presigned URL. Status: ${resp.status}`,
      {
        error: 'ParseError',
        message: 'Failed to parse JSON response',
        statusCode: resp.status,
      },
      resp.status,
    );
  }

  if (!resp.ok) {
    throw new BackendError(
      `Failed to generate presigned URL. Expected status 200. Received status ${resp.status}: ${resp.statusText}`,
      response,
      resp.status,
    );
  }

  return response;
};
