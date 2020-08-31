import Got from 'got';
import Boom from '@hapi/boom';
import createClient from './client';

export class Squidex<T extends { id: string; data: object }> {
  client: typeof Got;
  collection: string;

  constructor(collection: string) {
    this.collection = collection;
    this.client = createClient();
  }

  async fetch(query?: object): Promise<{ items: T[] }> {
    const q = {
      take: 30,
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
      return res as { items: T[] };
    } catch (err) {
      if (err.response?.statusCode === 404) {
        return {
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
      if (err.response?.statusCode === 404) {
        throw Boom.notFound();
      }

      throw Boom.badImplementation('squidex', {
        data: err,
      });
    }
  }

  async fetchOne(query: object): Promise<T> {
    const { items } = await this.fetch({
      ...query,
      take: 1,
    });

    if (items.length === 0) {
      throw Boom.notFound();
    }

    return items[0];
  }

  create(json: T['data'], publish = true): Promise<T> {
    return this.client
      .post(`${this.collection}`, {
        json,
        searchParams: {
          publish,
        },
      })
      .json();
  }

  patch(id: string, json: Partial<T['data']>): Promise<T> {
    return this.client.patch(`${this.collection}/${id}`, json).json();
  }

  delete(id: string): Promise<void> {
    return this.client.delete(`${this.collection}/${id}`).json();
  }
}
