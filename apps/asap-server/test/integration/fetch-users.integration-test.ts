import { Role, UserResponse } from '@asap-hub/model';
import { User } from '@asap-hub/squidex';
import Users from '../../src/controllers/users';
import { createUser } from '../helpers/users';

const users = new Users();

describe('Users', () => {
  test('Should create and fetch a user', async () => {
    const user: Partial<User> = {
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Project Manager',
      orcid: '0000-0002-9079-593X',
      institution: 'Instituto Superior Tecnico',
      email: 'john.doe@asap.science',
      role: 'Grantee' as Role,
      degree: 'MPH',
    };

    console.log(">>>>>>>>>>>>>>>>>>>>>>> Creating user");
    await createUser(user);

    console.log(">>>>>>>>>>>>>>>>>>>>>>> Fetching user");
    const result = await users.fetch({});

    const expectedResponse: Partial<UserResponse> = {
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      jobTitle: 'Project Manager',
      orcid: '0000-0002-9079-593X',
      institution: 'Instituto Superior Tecnico',
      email: 'john.doe@asap.science',
      role: 'Grantee',
      degree: 'MPH',
      teams: [],
      questions: [],
      skills: [],
    };

    expect(result).toEqual({
      total: 1,
      items: [expect.objectContaining(expectedResponse)],
    });
  });
});
