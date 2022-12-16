import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createUserResponse } from '@asap-hub/fixtures';
import WorkingGroupMembers from '../WorkingGroupMembers';

const props: ComponentProps<typeof WorkingGroupMembers> = {
  leaders: [],
  members: [],
};

describe('leaders section', () => {
  it('renders active leaders', () => {
    const { getByText } = render(
      <WorkingGroupMembers
        {...props}
        leaders={[
          {
            user: { ...createUserResponse(), displayName: 'Test User 1' },
            role: 'Chair',
            workstreamRole: 'A test role',
          },
        ]}
      />,
    );
    expect(getByText('Active Leaders (1)')).toBeVisible();
    expect(getByText('Past Leaders (0)')).toBeVisible();
    expect(getByText('Test User 1')).toBeVisible();
    expect(getByText('A test role')).toBeVisible();
  });

  it('renders past leaders', () => {
    const { getByText, queryByText } = render(
      <WorkingGroupMembers
        {...props}
        leaders={[
          {
            user: {
              ...createUserResponse(),
              displayName: 'Test User 1',
              alumniSinceDate: new Date().toISOString(),
            },
            role: 'Chair',
            workstreamRole: 'A test role',
          },
        ]}
      />,
    );

    const pastTabButton = getByText('Past Leaders (1)');
    const activeTabButton = getByText('Active Leaders (0)');

    expect(pastTabButton).toBeVisible();
    expect(activeTabButton).toBeVisible();
    expect(queryByText('Test User 1')).toBeNull();

    pastTabButton.click();
    expect(getByText('Test User 1')).toBeVisible();
    expect(getByText('A test role')).toBeVisible();

    activeTabButton.click();
    expect(queryByText('Test User 1')).toBeNull();
  });
});

describe('member section', () => {
  it('renders active members', () => {
    const { getByText } = render(
      <WorkingGroupMembers
        {...props}
        members={[
          {
            user: { ...createUserResponse(), displayName: 'Test User 1' },
          },
        ]}
      />,
    );
    expect(getByText('Active Members (1)')).toBeVisible();
    expect(getByText('Past Members (0)')).toBeVisible();
    expect(getByText('Test User 1')).toBeVisible();
  });

  it('renders past members', () => {
    const { getByText, queryByText } = render(
      <WorkingGroupMembers
        {...props}
        members={[
          {
            user: {
              ...createUserResponse(),
              displayName: 'Test User 1',
              alumniSinceDate: new Date().toISOString(),
            },
          },
        ]}
      />,
    );

    const pastTabButton = getByText('Past Members (1)');
    const activeTabButton = getByText('Active Members (0)');

    expect(pastTabButton).toBeVisible();
    expect(activeTabButton).toBeVisible();
    expect(queryByText('Test User 1')).toBeNull();

    pastTabButton.click();
    expect(getByText('Test User 1')).toBeVisible();

    activeTabButton.click();
    expect(queryByText('Test User 1')).toBeNull();
  });
});
