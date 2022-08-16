import { WorkingGroupResponse } from '@asap-hub/model/build/gp2';
import { render, screen } from '@testing-library/react';
import WorkingGroupsBody from '../WorkingGroupsBody';

describe('WorkingGroupsBody', () => {
  const getWorkingGroup = (overrides: Partial<WorkingGroupResponse> = {}) => ({
    id: '42',
    title: 'Working Group Title',
    members: [],
    shortDescription: 'This is a short description',
    leadingMembers: 'This is a list of leading members',
    ...overrides,
  });
  const getWorkingGroups = (items = [getWorkingGroup()]) => ({
    items,
    total: items.length,
  });

  it('renders a working group', () => {
    render(<WorkingGroupsBody workingGroups={getWorkingGroups()} />);
    expect(
      screen.getByRole('heading', { name: /Working Group Title/i }),
    ).toBeVisible();
  });

  it('renders multiple working groups', () => {
    const workingGroups = [
      getWorkingGroup({ id: '11', title: 'Working Group 11' }),
      getWorkingGroup({ id: '42', title: 'Working Group 42' }),
    ];

    const workingGroupsResponse = getWorkingGroups(workingGroups);

    render(<WorkingGroupsBody workingGroups={workingGroupsResponse} />);
    expect(
      screen.getByRole('heading', { name: /Working Group 11/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /Working Group 42/i }),
    ).toBeVisible();
  });
});
