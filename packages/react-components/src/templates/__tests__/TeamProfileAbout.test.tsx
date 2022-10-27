import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import TeamProfileAbout from '../TeamProfileAbout';

const props: ComponentProps<typeof TeamProfileAbout> = {
  projectTitle: '',
  expertiseAndResourceTags: [],
  members: [],
  teamListElementId: '',
};
it('renders the overview', () => {
  const { getByText } = render(
    <TeamProfileAbout {...props} projectTitle="Title" />,
  );

  expect(getByText(/overview/i)).toBeVisible();
  expect(getByText('Title')).toBeVisible();
});

it('renders the contact banner', () => {
  const { getByRole } = render(
    <TeamProfileAbout
      {...props}
      pointOfContact={{
        id: 'uuid',
        displayName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        role: 'Project Manager',
      }}
    />,
  );

  const link = getByRole('link');
  expect(link).toBeVisible();
  expect(link).toHaveAttribute('href', 'mailto:test@test.com');
});

it('renders the team list', () => {
  const { getByText } = render(
    <TeamProfileAbout
      {...props}
      members={[
        {
          id: 'uuid',
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Project Manager',
          email: 'johndoe@asap.com',
        },
      ]}
    />,
  );

  const avatar = getByText(/john doe/i);
  expect(avatar).toBeVisible();
  expect(avatar.closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/uuid/i),
  );
  expect(getByText('Project Manager')).toBeInTheDocument();
});
it('shows the lab list when present on member list', () => {
  const { queryByText, rerender } = render(
    <TeamProfileAbout
      {...props}
      members={[
        {
          id: 'uuid',
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Project Manager',
          email: 'johndoe@asap.com',
        },
      ]}
    />,
  );
  expect(queryByText('Lab')).not.toBeInTheDocument();
  rerender(
    <TeamProfileAbout
      {...props}
      members={[
        {
          id: 'uuid',
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Project Manager',
          email: 'johndoe@asap.com',
          labs: [{ name: 'Doe', id: '1' }],
        },
      ]}
    />,
  );
  expect(queryByText('Doe Lab')).toBeInTheDocument();
});

it('renders the expertise and resources list', () => {
  const { getByText } = render(
    <TeamProfileAbout
      {...props}
      expertiseAndResourceTags={['example expertise']}
    />,
  );
  expect(getByText(/example expertise/i)).toBeVisible();
  expect(getByText(/expertise and resources/i)).toBeVisible();
});

describe('when the team is inactive', () => {
  it('renders the past team list', () => {
    const { getByText } = render(
      <TeamProfileAbout
        {...props}
        inactiveSince={new Date().toISOString()}
        members={[
          {
            id: 'uuid',
            displayName: 'John Doe',
            firstName: 'John',
            lastName: 'Doe',
            role: 'Project Manager',
            email: 'johndoe@asap.com',
          },
        ]}
      />,
    );

    expect(getByText('Team Members')).toBeVisible();
    expect(getByText('Past Team Members (1)')).toBeVisible();
    const avatar = getByText(/john doe/i);
    expect(avatar).toBeVisible();
    expect(avatar.closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(/uuid/i),
    );
    expect(getByText('Project Manager')).toBeInTheDocument();
  });
});
