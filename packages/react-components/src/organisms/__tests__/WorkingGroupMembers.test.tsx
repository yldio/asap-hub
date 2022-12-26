import { ComponentProps } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { createUserResponse, createListUserResponse } from '@asap-hub/fixtures';
import WorkingGroupMembers from '../WorkingGroupMembers';

const props: ComponentProps<typeof WorkingGroupMembers> = {
  leaders: [],
  members: [],
  isComplete: false,
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

  it('renders both active and past leaders in past tab when working group is complete', () => {
    const { getByText } = render(
      <WorkingGroupMembers
        {...props}
        isComplete
        leaders={createListUserResponse(3).items.map((item, index) => ({
          user: {
            ...item,
            displayName: `Test User ${index}`,
            alumniSinceDate:
              index % 2 === 0 ? new Date().toISOString() : undefined,
          },
          role: 'Chair',
          workstreamRole: 'A test role',
        }))}
      />,
    );

    const pastTabButton = getByText('Past Leaders (3)');
    const activeTabButton = getByText('Active Leaders (0)');

    expect(pastTabButton).toBeVisible();
    expect(activeTabButton).toBeVisible();

    expect(getByText('Test User 0')).toBeVisible();
    expect(getByText('Test User 1')).toBeVisible();
    expect(getByText('Test User 2')).toBeVisible();
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

  it('shows the correct more and less button text', () => {
    const { getByText } = render(
      <WorkingGroupMembers
        {...props}
        members={createListUserResponse(10).items.map((item, index) => ({
          user: {
            ...item,
            displayName: `Test User ${index}`,
          },
        }))}
      />,
    );
    fireEvent.click(getByText('View More Members'));
    expect(getByText(/View Less Members/)).toBeVisible();
  });

  it('renders both active and past members in past tab when working group is complete', () => {
    const { getByText } = render(
      <WorkingGroupMembers
        {...props}
        isComplete
        members={createListUserResponse(3).items.map((item, index) => ({
          user: {
            ...item,
            displayName: `Test User ${index}`,
            alumniSinceDate:
              index % 2 === 0 ? new Date().toISOString() : undefined,
          },
        }))}
      />,
    );

    const pastTabButton = getByText('Past Members (3)');
    const activeTabButton = getByText('Active Members (0)');

    expect(pastTabButton).toBeVisible();
    expect(activeTabButton).toBeVisible();

    expect(getByText('Test User 0')).toBeVisible();
    expect(getByText('Test User 1')).toBeVisible();
    expect(getByText('Test User 2')).toBeVisible();
  });
});
