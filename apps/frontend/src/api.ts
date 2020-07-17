import { API_BASE_URL } from './config';

export default {
  users: {
    fetch: ({ headers, ...options }: RequestInit = {}) =>
      fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        ...options,
        headers: {
          'content-type': 'application/json',
          ...headers,
        },
      }),
    fetchById: (id: string, { headers, ...options }: RequestInit = {}) =>
      fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        ...options,
        headers: {
          'content-type': 'application/json',
          ...headers,
        },
      }),
  },
};
