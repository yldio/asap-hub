import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import WorkingGroupsBody from '../WorkingGroupsBody';

describe('WorkingGroupsBody', () => {
  it('renders a working group', () => {
    render(
      <WorkingGroupsBody workingGroups={gp2.createWorkingGroupsResponse()} />,
    );
    expect(
      screen.getByRole('heading', { name: /Working Group Title/i }),
    ).toBeVisible();
  });

  it('renders multiple working groups', () => {
    const workingGroups = [
      gp2.createWorkingGroupResponse({ id: '11', title: 'Working Group 11' }),
      gp2.createWorkingGroupResponse({ id: '42', title: 'Working Group 42' }),
    ];

    const workingGroupsResponse =
      gp2.createWorkingGroupsResponse(workingGroups);

    render(<WorkingGroupsBody workingGroups={workingGroupsResponse} />);
    expect(
      screen.getByRole('heading', { name: /Working Group 11/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /Working Group 42/i }),
    ).toBeVisible();
  });
});
