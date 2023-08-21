import { createUserResponse } from '@asap-hub/fixtures';
import { disable } from '@asap-hub/flags';
import {
  getUserRole,
  hasDuplicateResearchOutputPermission,
  hasEditResearchOutputPermission,
  hasPublishResearchOutputPermission,
  hasVersionResearchOutputPermission,
  hasRequestForReviewPermission,
  hasShareResearchOutputPermission,
  isActiveAndBelongsToAssociation,
  isProjectManagerAndActive,
} from '../../permissions/research-output';

const user = createUserResponse();

describe('isProjectManagerAndActive', () => {
  test.each`
    role                  | inactiveSinceDate | active       | association        | expected
    ${'Project Manager'}  | ${undefined}      | ${undefined} | ${'teams'}         | ${true}
    ${'Project Manager'}  | ${'2023-07-26'}   | ${undefined} | ${'teams'}         | ${false}
    ${'Project Manager'}  | ${undefined}      | ${true}      | ${'workingGroups'} | ${true}
    ${'Project Manager'}  | ${undefined}      | ${false}     | ${'workingGroups'} | ${false}
    ${'Collaborating PI'} | ${undefined}      | ${undefined} | ${'teams'}         | ${false}
    ${'Collaborating PI'} | ${'2023-07-26'}   | ${undefined} | ${'teams'}         | ${false}
    ${'Collaborating PI'} | ${undefined}      | ${true}      | ${'workingGroups'} | ${false}
    ${'Collaborating PI'} | ${undefined}      | ${false}     | ${'workingGroups'} | ${false}
  `(
    'returns $expected when role is $role, inactiveSinceDate is $inactiveSinceDate, active is $active, association is $association',
    ({ role, inactiveSinceDate, active, association, expected }) => {
      const testUser = {
        ...user,
        id: 'user-1',
        role,
        inactiveSinceDate,
        active,
      };
      const associationIds = ['user-1'];
      expect(
        isProjectManagerAndActive(testUser, association, associationIds),
      ).toEqual(expected);
    },
  );
});

describe('isActiveAndBelongsToAssociation', () => {
  test.each`
    role                  | inactiveSinceDate | active       | association        | expected
    ${'Collaborating PI'} | ${undefined}      | ${undefined} | ${'teams'}         | ${true}
    ${'Collaborating PI'} | ${'2023-07-26'}   | ${undefined} | ${'teams'}         | ${false}
    ${'Collaborating PI'} | ${undefined}      | ${true}      | ${'workingGroups'} | ${true}
    ${'Collaborating PI'} | ${undefined}      | ${false}     | ${'workingGroups'} | ${false}
  `(
    'returns $expected when role is $role, inactiveSinceDate is $inactiveSinceDate, active is $active, association is $association',
    ({ role, inactiveSinceDate, active, association, expected }) => {
      const testUser = {
        ...user,
        id: 'user-1',
        role,
        inactiveSinceDate,
        active,
      };
      const associationIds = ['user-1'];
      expect(
        isActiveAndBelongsToAssociation(testUser, association, associationIds),
      ).toEqual(expected);
    },
  );
});

describe.each`
  association        | associationId
  ${`teams`}         | ${`team-1`}
  ${`workingGroups`} | ${`wg-1`}
`(
  'getUserRole - $association',
  ({
    association,
    associationId,
  }: {
    association: 'teams' | 'workingGroups';
    associationId: string;
  }) => {
    test('returns Staff when user has asap role as staff', () => {
      expect(
        getUserRole({ ...user, role: 'Staff' }, association, [associationId]),
      ).toEqual('Staff');
    });

    test(`returns Staff when user is active Project Manager of ${association}`, () => {
      const userRole =
        association === 'teams'
          ? { inactiveSinceDate: undefined }
          : { active: true };
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
                ...userRole,
              },
            ],
          },
          association,
          [associationId],
        ),
      ).toEqual('Staff');
    });

    test(`returns Member when user is active and belongs to ${association} and they are not a PM`, () => {
      const userRole = association === 'teams' ? {} : { active: true };
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
                ...userRole,
              },
            ],
          },
          association,
          [associationId],
        ),
      ).toEqual('Member');
    });

    test(`returns None when user is inactive in ${association}`, () => {
      const userRole =
        association === 'teams'
          ? { inactiveSinceDate: '2023-07-26' }
          : { active: false };
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
                ...userRole,
              },
            ],
          },
          association,
          [associationId],
        ),
      ).toEqual('None');
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
  },
);

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

describe('hasVersionResearchOutputPermission', () => {
  test.each`
    userRole    | expected
    ${`Staff`}  | ${true}
    ${`Member`} | ${false}
    ${`None`}   | ${false}
  `(
    'returns $expected when user role is $userRole',
    ({ userRole, expected }) => {
      expect(hasVersionResearchOutputPermission(userRole)).toEqual(expected);
    },
  );

  test.each`
    userRole    | expected
    ${`Staff`}  | ${false}
    ${`Member`} | ${false}
    ${`None`}   | ${false}
  `(
    'returns $expected when user role is $userRole and feature flag is disabled',
    ({ userRole, expected }) => {
      disable('CONTENTFUL');
      expect(hasVersionResearchOutputPermission(userRole)).toEqual(expected);
    },
  );
});

describe('hasRequestForReviewPermission', () => {
  test.each`
    userRole    | expected
    ${`Staff`}  | ${false}
    ${`Member`} | ${true}
    ${`None`}   | ${false}
  `(
    'returns $expected when user role is $userRole',
    ({ userRole, expected }) => {
      expect(hasRequestForReviewPermission(userRole)).toEqual(expected);
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
