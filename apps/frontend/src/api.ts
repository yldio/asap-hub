import { API_BASE_URL } from './config';

export default {
  users: {
    fetch: () =>
      fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      }),
    fetchById: (id: string) =>
      fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      }),
  },
};
