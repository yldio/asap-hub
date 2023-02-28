import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import {
  fullPermissions,
  getUserPermissions,
  noPermissions,
  partialPermissions,
} from '../../src/permissions/research-output';

describe.each`
  entity             | entityId
  ${'teams'}         | ${'team-id'}
  ${'workingGroups'} | ${'working-group-id'}
`('getUserPermissions - $entity', ({ entity, entityId }) => {
  test('Should not have permissions when there is no user data', () => {
    expect(getUserPermissions(null, entity, [entityId])).toEqual(noPermissions);
  });

  describe('when asap-hub role is staff', () => {
    const staffUser: UserResponse = {
      ...createUserResponse(),
      role: 'Staff',
    };

    test('Should have full permission', () => {
      expect(getUserPermissions(staffUser, entity, [entityId])).toEqual(
        fullPermissions,
      );
    });
  });

  describe('when asap-hub role is not staff', () => {
    const nonStaffUser: UserResponse = {
      ...createUserResponse(),
      role: 'Grantee',
    };

    test('Should not have permissions when there is no entity ids', () => {
      expect(getUserPermissions(nonStaffUser, entity, [])).toEqual(
        noPermissions,
      );
    });

    test(`Should not have permissions if the user does not belong to the ${entity} and it is not a PM`, () => {
      expect(
        getUserPermissions(
          {
            ...nonStaffUser,
            [entity]: [
              {
                ...nonStaffUser[entity][0],
                id: 'entityId',
                role: 'Member',
              },
            ],
          },
          entity,
          ['do-not-belong'],
        ),
      ).toEqual(noPermissions);
    });

    test(`Should not have permissions if the user does not belong to the ${entity} and it is a PM`, () => {
      expect(
        getUserPermissions(
          {
            ...nonStaffUser,
            [entity]: [
              {
                ...nonStaffUser[entity][0],
                id: 'entityId',
                role: 'Project Manager',
              },
            ],
          },
          entity,
          ['do-not-belong'],
        ),
      ).toEqual(noPermissions);
    });

    test(`Should have partial permissions if the user is not a project manager but belongs to ${entity}`, () => {
      expect(
        getUserPermissions(
          {
            ...nonStaffUser,
            [entity]: [
              {
                ...nonStaffUser[entity][0],
                id: entityId,
                role: 'Member',
              },
            ],
          },
          entity,
          [entityId],
        ),
      ).toEqual(partialPermissions);
    });

    test(`Should have full permission if the user is a project manager of the ${entity}`, () => {
      expect(
        getUserPermissions(
          {
            ...nonStaffUser,
            [entity]: [
              {
                ...nonStaffUser[entity][0],
                id: entityId,
                role: 'Project Manager',
              },
            ],
          },
          entity,
          [entityId],
        ),
      ).toEqual(fullPermissions);
    });
  });
});
