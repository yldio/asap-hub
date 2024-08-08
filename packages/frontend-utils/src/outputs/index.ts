import {
  gp2,
  OutputGenerateContentResponse,
  ResearchOutputGenerateContentRequest,
} from '@asap-hub/model';
import { BackendError, createSentryHeaders } from '../api-util';

export const generateOutputContent = async (
  output:
    | ResearchOutputGenerateContentRequest
    | gp2.OutputGenerateContentRequest,
  url: string,
  authorization: string,
  app: 'CRN' | 'GP2',
): Promise<OutputGenerateContentResponse> => {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(output),
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
