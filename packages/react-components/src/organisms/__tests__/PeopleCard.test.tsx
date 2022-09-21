import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createUserResponse } from '@asap-hub/fixtures';

import PeopleCard from '../PeopleCard';

const props: ComponentProps<typeof PeopleCard> = createUserResponse();

it('renders the display name', () => {
  const { getByRole } = render(
    <PeopleCard {...props} displayName="John Doe" />,
  );
  expect(getByRole('heading').textContent).toEqual('John Doe');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('renders the display name and degree', () => {
  const { getByRole } = render(
    <PeopleCard {...props} displayName="John Doe" degree={'BA'} />,
  );
  expect(getByRole('heading').textContent).toEqual('John Doe, BA');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('renders the date in the correct format', () => {
  const { getByText } = render(
    <PeopleCard {...props} createdDate="2021-01-01" />,
  );
  expect(getByText(/joined/i).textContent).toMatchInlineSnapshot(
    `"Joined: 1st January 2021"`,
  );
});

it('links to the profile', () => {
  const { getByText } = render(
    <PeopleCard {...props} displayName="John Doe" id="42" />,
  );

  expect(getByText('John Doe').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

describe('alumni badge', () => {
  it('renders the alumni badge when required', () => {
    render(<PeopleCard {...props} alumniSinceDate="2022-01-01" />);
    expect(screen.getByTestId('alumni-badge')).toHaveTextContent('Alumni');
  });
  it('does not render alumni badge for non alumni', () => {
    render(<PeopleCard {...props} alumniSinceDate={undefined} />);
    expect(screen.queryByTestId('alumni-badge')).toBeNull();
  });
});
