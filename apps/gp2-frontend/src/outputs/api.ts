import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const createOutputApiUrl = ({
  search,
  take,
  skip,
  filter,
}: gp2.FetchOutputOptions) => {
  const url = new URL('outputs', `${API_BASE_URL}/`);
  if (search) url.searchParams.set('search', search);
  if (take) {
    url.searchParams.set('take', String(take));
  }
  if (skip) {
    url.searchParams.set('skip', String(skip));
  }
  const addFilter = (name: string, items?: string[]) =>
    items?.forEach((item) => url.searchParams.append(`filter[${name}]`, item));
  addFilter(
    'workingGroup',
    filter?.workingGroup ? [filter?.workingGroup] : undefined,
  );
  addFilter('project', filter?.project ? [filter?.project] : undefined);
  addFilter('author', filter?.author ? [filter?.author] : undefined);

  return url;
};

export const getOutput = async (
  id: string,
  authorization: string,
): Promise<gp2.OutputResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/outputs/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch output with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getOutputs = async (
  authorization: string,
  options: gp2.FetchOutputOptions,
): Promise<gp2.ListOutputResponse> => {
  const resp = await fetch(createOutputApiUrl(options), {
    headers: { authorization, ...createSentryHeaders() },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the Outputs. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const createOutput = async (
  output: gp2.OutputPostRequest,
  authorization: string,
): Promise<gp2.OutputResponse> => {
  const resp = await fetch(`${API_BASE_URL}/outputs`, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(output),
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to create output. Expected status 201. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const updateOutput = async (
  outputId: string,
  output: gp2.OutputPutRequest,
  authorization: string,
): Promise<gp2.OutputResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/outputs/${outputId}`, {
    method: 'PUT',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(output),
  });

  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to update output ${outputId}. Expected status 200. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
