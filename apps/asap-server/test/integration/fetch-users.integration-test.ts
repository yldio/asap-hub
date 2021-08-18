import Chance from 'chance';

import { Role, UserResponse } from '@asap-hub/model';
import { User } from '@asap-hub/squidex';
import Users from '../../src/controllers/users';
import { createUser, createRandomOrcid } from '../helpers/users';

const chance = new Chance();
const users = new Users();

describe('Users', () => {
  test('Should create and fetch a user', async () => {
    const randomEmail = chance.email();
    const randomName = chance.guid();
    const randomOrcid = createRandomOrcid();

    const user: Partial<User> = {
      firstName: 'John',
      lastName: randomName,
      jobTitle: 'Project Manager',
      orcid: randomOrcid,
      institution: 'Instituto Superior Tecnico',
      email: randomEmail,
      role: 'Grantee' as Role,
      degree: 'MPH',
    };

    await createUser(user);

    const result = await users.fetch({
      search: randomName,
    });

    const expectedResponse: Partial<UserResponse> = {
      firstName: 'John',
      lastName: randomName,
      displayName: 'John ' + randomName,
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

  test('Invalid orcids should fail', async () => {
    const randomEmail = chance.email();
    const randomName = chance.guid();

    // Refactor duplicate user like above?
    const user: Partial<User> = {
      firstName: 'John',
      lastName: randomName,
      jobTitle: 'Project Manager',
      orcid: 'invalid orcid',
      institution: 'Instituto Superior Tecnico',
      email: randomEmail,
      role: 'Grantee' as Role,
      degree: 'MPH',
    };

    try {
      const result = await createUser(user);
      console.log(result);
    } catch (e) {
      expect(e.name).toBe('HTTPError');
      expect(e.output.statusCode).toBe(400);

      const parsedErrorData = JSON.parse(e.data);
      expect(parsedErrorData.details[0]).toBe(
        'orcid.iv: ORCID must have the following format: 0000-0000-0000-0000',
      );
    }
  });

  test.only('Duplicate orcids should fail', async () => {
    const randomEmail = chance.email();
    const randomName = chance.guid();
    const randomOrcid = createRandomOrcid();

    // Refactor duplicate user like above?
    const user: Partial<User> = {
      firstName: 'John',
      lastName: randomName,
      jobTitle: 'Project Manager',
      orcid: randomOrcid,
      institution: 'Instituto Superior Tecnico',
      email: randomEmail,
      role: 'Grantee' as Role,
      degree: 'MPH',
    };

    const duplicateUser: Partial<User> = {
      firstName: 'John',
      lastName: randomName,
      jobTitle: 'Project Manager',
      orcid: randomOrcid,
      institution: 'Instituto Superior Tecnico',
      email: chance.email(),
      role: 'Grantee' as Role,
      degree: 'MPH',
    };

    await createUser(user);

    try {
      await createUser(duplicateUser);
    } catch (e) {
      expect(e.name).toBe('HTTPError');
      expect(e.output.statusCode).toBe(400);

      const parsedErrorData = JSON.parse(e.data);
      expect(parsedErrorData.details[0]).toBe(
        'orcid.iv: Another content with the same value exists.',
      );
    }
  });
});
