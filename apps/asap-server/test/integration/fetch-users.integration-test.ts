import { Role } from '@asap-hub/model';
import Users from '../../src/controllers/users';
import { createUser } from '../helpers/users';

const users = new Users();

describe('Users', () => {
  test('Should create and fetch a user', async () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Project Manager',
      orcid: '0000-0002-9079-593X',
      institution: 'Instituto Superior Tecnico',
      email: 'john.doe@asap.science',
      role: 'Grantee' as Role,
    };

    await createUser(user);

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
