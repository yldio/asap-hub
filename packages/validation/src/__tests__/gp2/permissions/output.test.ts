import { gp2 } from '@asap-hub/fixtures';
import { getUserRole } from '../../../gp2/permissions/output';

const user = gp2.createUserResponse();
describe.each`
  association        | associationId  | associationType    | role
  ${`projects`}      | ${`project-1`} | ${`Projects`}      | ${`Project manager`}
  ${`workingGroups`} | ${`wg-1`}      | ${`WorkingGroups`} | ${`Lead`}
`(
  'getUserRole - $association',
  ({
    association,
    associationId,
    associationType,
    role,
  }: {
    association: 'projects' | 'workingGroups';
    associationId: string;
    associationType: 'Projects' | 'WorkingGroups';
    role: 'Project manager' | 'Lead';
  }) => {
    test('returns user role', () => {
      expect(
        getUserRole(
          {
            ...user,
            [association]: [
              {
                ...user[association][0],
                id: associationId,
                members: [{ userId: user.id, role }],
              },
            ],
          },
          associationType,
          associationId,
        ),
      ).toEqual(role);
    });
  },
);
