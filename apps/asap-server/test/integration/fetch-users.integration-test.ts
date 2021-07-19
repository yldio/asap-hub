import Chance from 'chance';

import { Role, UserResponse } from '@asap-hub/model';
import { User } from '@asap-hub/squidex';
import Users from '../../src/controllers/users';
import { createUser } from '../helpers/users';

const chance = new Chance();
const users = new Users();

describe('Users', () => {
  test('Should create and fetch a user', async () => {
    const randomOrcid = chance.ssn();
    const randomEmail = chance.email();

    const user: Partial<User> = {
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Project Manager',
      orcid: randomOrcid,
      institution: 'Instituto Superior Tecnico',
      email: randomEmail,
      role: 'Grantee' as Role,
      degree: 'MPH',
    };

    // console.log(">>>>>>>>>>>>>>>>>>>>>>> Creating user");
    await createUser(user);

    // console.log(">>>>>>>>>>>>>>>>>>>>>>> Fetching user");
    const result = await users.fetch({});

    const expectedResponse: Partial<UserResponse> = {
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      jobTitle: 'Project Manager',
      orcid: randomOrcid,
      institution: 'Instituto Superior Tecnico',
      email: randomEmail,
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
