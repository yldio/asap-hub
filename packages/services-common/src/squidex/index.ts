import Got from 'got';
import Boom from '@hapi/boom';
import createClient from './client';

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

export class Squidex<T extends { id: string; data: object }> {
  client: typeof Got;
  collection: string;

  constructor(collection: string) {
    this.collection = collection;
    this.client = createClient();
  }

  async fetch(query?: Query): Promise<Results<T>> {
    const q = {
      take: 8,
      ...query,
    };

    try {
      const res = await this.client
        .get(this.collection, {
          searchParams: {
            q: JSON.stringify(q),
          },
        })
        .json();
      return res as Results<T>;
    } catch (err) {
      if (
        err.response?.statusCode === 400 &&
        err.response?.body.includes('invalid_client')
      ) {
        throw Boom.unauthorized();
      }

      if (err.response?.statusCode === 404) {
        return {
          total: 0,
          items: [],
        };
      }

      throw Boom.badImplementation('squidex', {
        data: err,
      });
    }
  }

  async fetchById(id: string): Promise<T> {
    try {
      const res = await this.client.get(`${this.collection}/${id}`).json();
      return res as T;
    } catch (err) {
      if (
        err.response?.statusCode === 400 &&
        err.response?.body.includes('invalid_client')
      ) {
        throw Boom.unauthorized();
      }

      if (err.response?.statusCode === 404) {
        throw Boom.notFound();
      }

      throw Boom.badImplementation('squidex', {
        data: err.response?.body || err,
      });
    }
  }

  async fetchOne(query: Query): Promise<T> {
    const { items } = await this.fetch({
      ...query,
      take: 1,
    });

    if (items.length === 0) {
      throw Boom.notFound();
    }

    return items[0];
  }

  async create(json: T['data'], publish = true): Promise<T> {
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
      if (err.response?.statusCode === 409) {
        throw Boom.conflict()
      }

      if (
        err.response?.statusCode === 400 &&
        err.response?.body.includes('invalid_client')
      ) {
        throw Boom.unauthorized();
      }

      throw Boom.badImplementation('squidex', {
        data: err.response?.body || err,
      });
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
      if (
        err.response?.statusCode === 400 &&
        err.response?.body.includes('invalid_client')
      ) {
        throw Boom.unauthorized();
      }

      throw Boom.badImplementation('squidex', {
        data: err.response?.body || err,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.client.delete(`${this.collection}/${id}`).json();
    } catch (err) {
      if (
        err.response?.statusCode === 400 &&
        err.response?.body.includes('invalid_client')
      ) {
        throw Boom.unauthorized();
      }

      throw Boom.badImplementation('squidex', {
        data: err.response?.body || err,
      });
    }
  }
}
