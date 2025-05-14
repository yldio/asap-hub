import { ContentGeneratorResponse } from '@asap-hub/model';
import { BackendError, createSentryHeaders } from '../api-util';

export const generateContent = async (
  description: string,
  url: string,
  authorization: string,
  app: 'CRN' | 'GP2',
): Promise<ContentGeneratorResponse> => {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify({ description }),
  });

  const response = await resp.json();

  if (!resp.ok) {
    const entityName = app === 'CRN' ? 'research output' : 'output';
    throw new BackendError(
      `Failed to generate content for ${entityName}. Expected status 200. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }

  return response;
};
