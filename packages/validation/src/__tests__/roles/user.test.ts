import { Role, TeamRole } from '@asap-hub/model';
import { isCMSAdministrator } from '../../roles';

describe('isCMSAdministrator', () => {
  it.each`
    userRole     | teamRole                       | expected
    ${'Staff'}   | ${'Lead PI (Core Leadership)'} | ${true}
    ${'Staff'}   | ${'Co-PI (Core Leadership)'}   | ${true}
    ${'Staff'}   | ${'Collaborating PI'}          | ${true}
    ${'Staff'}   | ${'Project Manager'}           | ${true}
    ${'Staff'}   | ${'Key Personnel'}             | ${true}
    ${'Staff'}   | ${'Scientific Advisory Board'} | ${true}
    ${'Staff'}   | ${'ASAP Staff'}                | ${true}
    ${'Staff'}   | ${undefined}                   | ${true}
    ${'Grantee'} | ${'Lead PI (Core Leadership)'} | ${false}
    ${'Grantee'} | ${'Co-PI (Core Leadership)'}   | ${false}
    ${'Grantee'} | ${'Collaborating PI'}          | ${false}
    ${'Grantee'} | ${'Project Manager'}           | ${false}
    ${'Grantee'} | ${'Key Personnel'}             | ${false}
    ${'Grantee'} | ${'Scientific Advisory Board'} | ${false}
    ${'Grantee'} | ${'ASAP Staff'}                | ${true}
    ${'Grantee'} | ${undefined}                   | ${false}
    ${'Guest'}   | ${'Lead PI (Core Leadership)'} | ${false}
    ${'Guest'}   | ${'Co-PI (Core Leadership)'}   | ${false}
    ${'Guest'}   | ${'Collaborating PI'}          | ${false}
    ${'Guest'}   | ${'Project Manager'}           | ${false}
    ${'Guest'}   | ${'Key Personnel'}             | ${false}
    ${'Guest'}   | ${'Scientific Advisory Board'} | ${false}
    ${'Guest'}   | ${'ASAP Staff'}                | ${true}
    ${'Guest'}   | ${undefined}                   | ${false}
    ${'Hidden'}  | ${'Lead PI (Core Leadership)'} | ${false}
    ${'Hidden'}  | ${'Co-PI (Core Leadership)'}   | ${false}
    ${'Hidden'}  | ${'Collaborating PI'}          | ${false}
    ${'Hidden'}  | ${'Project Manager'}           | ${false}
    ${'Hidden'}  | ${'Key Personnel'}             | ${false}
    ${'Hidden'}  | ${'Scientific Advisory Board'} | ${false}
    ${'Hidden'}  | ${'ASAP Staff'}                | ${true}
    ${'Hidden'}  | ${undefined}                   | ${false}
  `(
    `gives the correct output for user role $userRole and team role $teamRole`,
    ({
      userRole,
      teamRole,
      expected,
    }: {
      userRole: Role;
      teamRole: TeamRole;
      expected: boolean;
    }) => {
      expect(isCMSAdministrator(userRole, teamRole)).toEqual(expected);
    },
  );
});
