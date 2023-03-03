import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import WorkingGroupsBody from '../WorkingGroupsBody';

describe('WorkingGroupsBody', () => {
  it('renders the %s working groups networks', () => {
    const workingGroupsResponse =
      gp2Fixtures.createWorkingGroupNetworkResponse();

    render(<WorkingGroupsBody workingGroupNetwork={workingGroupsResponse} />);
    expect(
      screen.getByRole('heading', { name: /Operational Working Groups/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /Monogenic Working Groups/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /Complex Disease Working Groups/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /Support Working Groups/i }),
    ).toBeVisible();
  });
});
