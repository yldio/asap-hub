import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import TeamProfilePage from '../TeamProfilePage';

const boilerplateProps: Omit<
  ComponentProps<typeof TeamProfilePage>,
  'children'
> = {
  id: '42',
  teamId: 'TI1',
  grantId: '000123',
  projectTitle: 'Unknown',
  type: 'Discovery',
  displayName: 'Doe, J',
  lastModifiedDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  members: [],
  tags: [],
  manuscripts: [],
  teamListElementId: '',
  labCount: 15,
  upcomingEventsCount: 0,
  isStaff: false,
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
  expect(getByTitle('Warning')).toBeInTheDocument();
});

it('does not render the inactive team header for active team', () => {
  const { queryByText } = render(
    <TeamProfilePage {...boilerplateProps} inactiveSince={undefined} />,
  );
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
