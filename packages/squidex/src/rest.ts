import { GenericError, ValidationError, NotFoundError } from '@asap-hub/errors';
import Got, { HTTPError } from 'got';
import createClient, { GetAccessToken } from './auth';
import { parseErrorResponseBody } from './helpers';

export interface Results<T> {
  total: number;
  items: T[];
}

export interface Filter {
  path: string;
  op:
    | 'eq'
    | 'in'
    | 'gt'
    | 'lt'
    | 'le'
    | 'ge'
    | 'ne'
    | 'contains'
    | 'startsWith'
    | 'endsWith';
  value: string[] | number[] | string | number | boolean;
}

export interface Query {
  take?: number;
  skip?: number;
  filter?:
    | {
        and?: Filter[];
        not?: Filter;
        or?: Filter[];
      }
    | Filter;
  sort?: {
    path: string;
    order?: 'ascending' | 'descending';
  }[];
}

export interface ODataQuery {
  $top?: number;
  $skip?: number;
  $filter?: string;
  $orderby?: string;
  $search?: string;
}

interface SquidexResponseError {
  message: string;
  details: string[];
}

const isSquidexError = (
  error: unknown | GenericError,
): error is SquidexResponseError =>
  Array.isArray((error as SquidexResponseError)?.details);

export class Squidex<
  T extends { id: string; data: Record<string, unknown> },
  C extends { id: string; data: Record<string, unknown> } = T,
> {
  client: typeof Got;
  collection: string;

  constructor(
    collection: string,
    getAccessToken: GetAccessToken,
    options?: Parameters<typeof createClient>[0],
  ) {
    this.collection = collection;
    this.client = createClient(options, getAccessToken);
  }

  async fetch(query: ODataQuery | Query = {}): Promise<Results<T>> {
    const searchParams = Object.keys(query).includes('$orderby')
      ? ({
          $top: 8,
          ...query,
        } as { [key: string]: string | number | undefined })
      : {
          q: JSON.stringify({
            take: 8,
            ...query,
          }) as string,
        };

    try {
      const res = await this.client
        .get(this.collection, {
          searchParams,
        })
        .json();
      return res as Results<T>;
    } catch (err) {
      if (err instanceof HTTPError) {
        if (err.response.statusCode === 404) {
          return {
            total: 0,
            items: [],
          };
        }
      }

      throw new GenericError(err);
    }
  }

  async fetchById(id: string): Promise<T> {
    try {
      const res = await this.client.get(`${this.collection}/${id}`).json();
      return res as T;
    } catch (err) {
      if (err instanceof HTTPError) {
        if (err.response.statusCode === 404) {
          throw new NotFoundError(err);
        }
      }

      throw new GenericError(err);
    }
  }

  async fetchOne(query: Query): Promise<T> {
    const { items } = await this.fetch({
      ...query,
      take: 1,
    });

    if (items.length === 0) {
      throw new NotFoundError(new Error('Not Found'));
    }

    return items[0];
  }

  async create(json: C['data'], publish = true): Promise<T> {
    try {
      const res = await this.client
        .post(`${this.collection}`, {
          json,
          searchParams: {
            publish,
          },
        })
        .json();
      return res as T;
    } catch (err) {
      if (err instanceof HTTPError) {
        if (err.response.statusCode === 400) {
          let body: unknown;
          try {
            body = parseErrorResponseBody(err);
          } catch {
            body = err.response.body;
          }

          if (isSquidexError(body) && body?.message === 'Validation error') {
            throw new ValidationError(err, body.details);
          }
        }
      }

      throw new GenericError(err);
    }
  }

  async upsert(id: string, json: T['data'], publish = true): Promise<T> {
    try {
      const res = await this.client
        .patch(`${this.collection}/${id}`, {
          json,
          searchParams: {
            publish,
          },
        })
        .json();
      return res as T;
    } catch (err) {
      if (err instanceof HTTPError) {
        if (err.response?.statusCode === 400) {
          let body: unknown;
          try {
            body = JSON.parse(String(err.response.body));
          } catch {
            body = err.response.body;
          }

          if (isSquidexError(body) && body?.message === 'Validation error') {
            throw new ValidationError(err, body.details);
          }
        }
      }

      throw new GenericError(err);
    }
  }

  async patch(id: string, json: Partial<T['data']>): Promise<T> {
    try {
      const res = await this.client
        .patch(`${this.collection}/${id}`, {
          json,
        })
        .json();
      return res as T;
    } catch (err) {
      if (err instanceof HTTPError) {
        if (err.response.statusCode === 404) {
          throw new NotFoundError(err);
        }
      }

      throw new GenericError(err);
    }
  }

  async put(id: string, json: Partial<T['data']>): Promise<T> {
    try {
      const res = await this.client
        .put(`${this.collection}/${id}`, {
          json,
        })
        .json();
      return res as T;
    } catch (err) {
      if (err instanceof HTTPError) {
        if (err.response?.statusCode === 404) {
          throw new NotFoundError(err);
        }
      }

      throw new GenericError(err);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.client.delete(`${this.collection}/${id}`).json();
    } catch (err) {
      throw new GenericError(err);
    }
  }
}

export type SquidexRestClient<
  T extends { id: string; data: Record<string, unknown> },
  C extends { id: string; data: Record<string, unknown> } = T,
> = Squidex<T, C>;
