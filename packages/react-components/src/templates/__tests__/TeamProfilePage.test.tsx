import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import TeamProfilePage from '../TeamProfilePage';

const boilerplateProps: Omit<
  ComponentProps<typeof TeamProfilePage>,
  'children'
> = {
  id: '42',
  projectTitle: 'Unknown',
  displayName: 'Doe, J',
  lastModifiedDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  members: [],
  expertiseAndResourceTags: [],
  teamListElementId: '',
  labCount: 15,
  upcomingEventsCount: 0,
};

it('renders the header', () => {
  const { getByText } = render(
    <TeamProfilePage {...boilerplateProps}>Tab Content</TeamProfilePage>,
  );
  expect(getByText('Team Doe, J')).toBeVisible();
});

it('renders the inactive team header for inactive team', () => {
  const { getByText, getByTitle } = render(
    <TeamProfilePage
      {...boilerplateProps}
      inactiveSince="2022-09-30T09:00:00Z"
    />,
  );
  expect(
    getByText(
      'This team is inactive and might not have all content available.',
    ),
  ).toBeVisible();
  expect(getByTitle('Info Circle Yellow')).toBeInTheDocument();
});

it('does not render the inactive team header for active team', () => {
  const { queryByText } = render(<TeamProfilePage {...boilerplateProps} />);
  expect(
    queryByText(
      'This team is inactive and might not have all content available.',
    ),
  ).not.toBeInTheDocument();
});

it('renders the children', () => {
  const { getByText } = render(
    <TeamProfilePage {...boilerplateProps}>Tab Content</TeamProfilePage>,
  );
  expect(getByText('Tab Content')).toBeVisible();
});
