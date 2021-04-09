import { Squidex, RestUser } from '@asap-hub/squidex';
import Users from '../../src/controllers/users';

const users = new Users();
const squidex = new Squidex<RestUser>('users');

describe('Users', () => {
  test('Should be create and fetch a user', async () => {
    const user: RestUser['data'] = {
      firstName: { iv: 'John' },
      lastName: { iv: 'Doe' },
      jobTitle: { iv: 'Project Manager' },
      orcid: { iv: '0000-0002-9079-593X' },
      institution: { iv: 'Instituto Superior Tecnico' },
      email: { iv: 'john.doe@asap.science' },
      role: { iv: 'Grantee' },
      connections: { iv: [] },
      questions: { iv: [] },
      teams: { iv: [] },
      avatar: { iv: [] },
      skills: { iv: [] },
    };

    await squidex.create(user);

    const result = await users.fetch({});

    expect(result).toEqual({
      total: 1,
      items: [
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John Doe',
          jobTitle: 'Project Manager',
          orcid: '0000-0002-9079-593X',
          institution: 'Instituto Superior Tecnico',
          email: 'john.doe@asap.science',
          role: 'Grantee',
          teams: [],
          questions: [],
          skills: [],
        }),
      ],
    });
  });
});
