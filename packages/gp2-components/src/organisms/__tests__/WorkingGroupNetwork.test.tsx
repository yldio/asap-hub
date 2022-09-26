import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import WorkingGroupNetwork from '../WorkingGroupNetwork';

describe('WorkingGroupBody', () => {
  it('renders a working group for a role', () => {
    const workingGroups = [
      gp2.createWorkingGroupResponse({ id: '11', title: 'Working Group 11' }),
    ];
    const workingGroupNetwork = {
      total: 1,
      items: [{ role: 'complexDisease' as const, workingGroups }],
    };

    render(
      <WorkingGroupNetwork
        role={'complexDisease'}
        workingGroupNetwork={workingGroupNetwork}
      />,
    );
    expect(
      screen.getByRole('heading', { name: /Working Group 11/i }),
    ).toBeVisible();
  });

  it('renders multiple working groups', () => {
    const workingGroups = [
      gp2.createWorkingGroupResponse({ id: '11', title: 'Working Group 11' }),
      gp2.createWorkingGroupResponse({ id: '42', title: 'Working Group 42' }),
    ];

    const workingGroupNetwork = {
      total: 1,
      items: [{ role: 'complexDisease' as const, workingGroups }],
    };

    render(
      <WorkingGroupNetwork
        role={'complexDisease'}
        workingGroupNetwork={workingGroupNetwork}
      />,
    );
    expect(
      screen.getByRole('heading', { name: /Working Group 11/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /Working Group 42/i }),
    ).toBeVisible();
  });

  it('filters out working groups from another network', () => {
    const workingGroups = [
      gp2.createWorkingGroupResponse({ id: '11', title: 'Working Group 11' }),
    ];
    const ignoredWorkingGroups = [
      gp2.createWorkingGroupResponse({ id: '42', title: 'Working Group 42' }),
    ];
    const workingGroupNetwork = {
      total: 1,
      items: [
        { role: 'support' as const, workingGroups: ignoredWorkingGroups },
        { role: 'complexDisease' as const, workingGroups },
      ],
    };

    render(
      <WorkingGroupNetwork
        role={'complexDisease'}
        workingGroupNetwork={workingGroupNetwork}
      />,
    );
    expect(
      screen.getByRole('heading', { name: /Working Group 11/i }),
    ).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: /Working Group 42/i }),
    ).not.toBeInTheDocument();
  });
});
