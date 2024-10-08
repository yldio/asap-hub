import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import UserWorkingGroups from '../UserWorkingGroups';

describe('UserWorkingGroups', () => {
  type WorkingGroup = gp2.UserResponse['workingGroups'][number];
  const getWorkingGroups = (length = 1): WorkingGroup[] =>
    Array.from({ length }, (_, itemIndex) => ({
      id: `id-${itemIndex}`,
      title: `a title ${itemIndex}`,
      members: [],
      role: 'Co-lead',
    }));
  const id = 'user-id';
  const renderUserWorkingGroups = (workingGroups: WorkingGroup[]) =>
    render(<UserWorkingGroups workingGroups={workingGroups} id={id} />);
  it('renders the short text when there are no working-groups', () => {
    renderUserWorkingGroups([]);
    expect(
      screen.getByText('This member is involved', { exact: false }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', {
        name: /you are not associated to any working groups/i,
      }),
    ).toBeVisible();
  });

  it('renders working-group titles', () => {
    renderUserWorkingGroups(getWorkingGroups(2));
    expect(screen.getByRole('link', { name: 'a title 0' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'a title 1' })).toBeVisible();
  });

  it('renders working-group member count', () => {
    const workingGroup = getWorkingGroups(1)[0]!;
    workingGroup.members = [
      { userId: 'user-1', role: 'Co-lead' },
      { userId: 'user-2', role: 'Co-lead' },
    ];
    renderUserWorkingGroups([workingGroup]);
    expect(screen.getByText('2 Members')).toBeVisible();
  });

  it('renders working-group member single count', () => {
    const workingGroup = getWorkingGroups(1)[0]!;
    workingGroup.members = [{ userId: 'user-1', role: 'Co-lead' }];
    renderUserWorkingGroups([workingGroup]);
    expect(screen.getByText('1 Member')).toBeVisible();
  });

  it.each(gp2.workingGroupMemberRole)('renders the role - %s', (role) => {
    const workingGroups: WorkingGroup = {
      ...getWorkingGroups(1)[0]!,
      members: [{ userId: id, role }],
    };
    render(<UserWorkingGroups workingGroups={[workingGroups]} id={id} />);
    expect(screen.getByText(role)).toBeVisible();
  });
  it('should not render role column if onboarding', () => {
    const workingGroup = {
      ...getWorkingGroups(1)[0]!,
      members: [{ userId: id, role: gp2.workingGroupMemberRole[0] }],
    };
    render(
      <UserWorkingGroups workingGroups={[workingGroup]} id={id} isOnboarding />,
    );
    expect(screen.queryByText('Role')).not.toBeInTheDocument();
  });

  it('does not render more than 4 working-groups', async () => {
    const workingGroups = getWorkingGroups(4);

    renderUserWorkingGroups(workingGroups);

    expect(screen.getByText('a title 2')).toBeVisible();
    expect(
      screen.queryByRole('link', { name: /a title 3/i }),
    ).not.toBeInTheDocument();
  });
});
