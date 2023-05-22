import { createUserResponse } from '@asap-hub/fixtures';
import { disable } from '@asap-hub/flags';
import { UserResponse } from '@asap-hub/model';
import {
  getUserRole,
  hasDuplicateResearchOutputPermission,
  hasEditResearchOutputPermission,
  hasPublishResearchOutputPermission,
  hasShareResearchOutputPermission,
} from '../../src/permissions/research-output';

const user = createUserResponse();

describe.each`
  association        | associationId
  ${`teams`}         | ${`team-1`}
  ${`workingGroups`} | ${`wg-1`}
`('getUserRole - $association', ({ association, associationId }) => {
  test('returns Staff when user has asap role as staff', () => {
    expect(
      getUserRole({ ...user, role: 'Staff' }, association, associationId),
    ).toEqual('Staff');
  });

  test(`returns Staff when user is Project Manager of ${association}`, () => {
    expect(
      getUserRole(
        {
          ...user,
          role: 'Grantee',
          [association]: [
            {
              ...user[association][0],
              id: associationId,
              role: 'Project Manager',
            },
          ],
        },
        association,
        [associationId],
      ),
    ).toEqual('Staff');
  });

  test(`returns Member when user belongs to ${association} and they are not a PM`, () => {
    expect(
      getUserRole(
        {
          ...user,
          role: 'Grantee',
          [association]: [
            {
              ...user[association][0],
              id: associationId,
              role: 'Collaborating PI',
            },
          ],
        },
        association,
        [associationId],
      ),
    ).toEqual('Member');
  });

  test(`returns None when user does not belong to ${association}`, () => {
    expect(
      getUserRole(
        {
          ...user,
          role: 'Grantee',
          [association]: [
            {
              ...user[association][0],
              id: associationId,
              role: 'Collaborating PI',
            },
          ],
        },
        association,
        ['does-not-belong'],
      ),
    ).toEqual('None');
  });

  test(`returns None when user data is null`, () => {
    expect(getUserRole(null, association, [associationId])).toEqual('None');
  });
});

describe('hasShareResearchOutputPermission', () => {
  test.each`
    userRole    | expected
    ${`Staff`}  | ${true}
    ${`Member`} | ${true}
    ${`None`}   | ${false}
  `(
    'returns $expected when user role is $userRole',
    ({ userRole, expected }) => {
      expect(hasShareResearchOutputPermission(userRole)).toEqual(expected);
    },
  );

  test.each`
    userRole    | expected
    ${`Staff`}  | ${true}
    ${`Member`} | ${false}
    ${`None`}   | ${false}
  `(
    'returns $expected when user role is $userRole and feature flag is disabled',
    ({ userRole, expected }) => {
      disable('DRAFT_RESEARCH_OUTPUT');
      expect(hasShareResearchOutputPermission(userRole)).toEqual(expected);
    },
  );
});

describe('hasPublishResearchOutputPermission', () => {
  test.each`
    userRole    | expected
    ${`Staff`}  | ${true}
    ${`Member`} | ${false}
    ${`None`}   | ${false}
  `(
    'returns $expected when user role is $userRole',
    ({ userRole, expected }) => {
      expect(hasPublishResearchOutputPermission(userRole)).toEqual(expected);
    },
  );
});

describe('hasDuplicateResearchOutputPermission', () => {
  test.each`
    userRole    | expected
    ${`Staff`}  | ${true}
    ${`Member`} | ${true}
    ${`None`}   | ${false}
  `(
    'returns $expected when user role is $userRole',
    ({ userRole, expected }) => {
      expect(hasDuplicateResearchOutputPermission(userRole)).toEqual(expected);
    },
  );
  test.each`
    userRole    | expected
    ${`Staff`}  | ${true}
    ${`Member`} | ${false}
    ${`None`}   | ${false}
  `(
    'returns $expected when user role is $userRole and feature flag is disabled',
    ({ userRole, expected }) => {
      disable('DRAFT_RESEARCH_OUTPUT');
      expect(hasShareResearchOutputPermission(userRole)).toEqual(expected);
    },
  );
});

describe('hasEditResearchOutputPermission', () => {
  test.each`
    userRole    | published | expected
    ${`Staff`}  | ${true}   | ${true}
    ${`Staff`}  | ${false}  | ${true}
    ${`Member`} | ${true}   | ${false}
    ${`Member`} | ${false}  | ${true}
    ${`None`}   | ${true}   | ${false}
    ${`None`}   | ${false}  | ${false}
  `(
    'returns $expected when user role is $userRole and published is $published',
    ({ userRole, published, expected }) => {
      expect(hasEditResearchOutputPermission(userRole, published)).toEqual(
        expected,
      );
    },
  );

  test.each`
    userRole    | published | expected
    ${`Staff`}  | ${true}   | ${true}
    ${`Staff`}  | ${false}  | ${true}
    ${`Member`} | ${true}   | ${false}
    ${`Member`} | ${false}  | ${false}
    ${`None`}   | ${true}   | ${false}
    ${`None`}   | ${false}  | ${false}
  `(
    'returns $expected when user role is $userRole, published is $published and feature flag is disabled',
    ({ userRole, published, expected }) => {
      disable('DRAFT_RESEARCH_OUTPUT');
      expect(hasEditResearchOutputPermission(userRole, published)).toEqual(
        expected,
      );
    },
  );
});
