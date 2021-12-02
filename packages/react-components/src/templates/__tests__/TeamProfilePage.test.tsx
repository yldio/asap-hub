import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

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
};

it('renders the header', () => {
  const { getByText } = render(
    <TeamProfilePage {...boilerplateProps}>Tab Content</TeamProfilePage>,
  );
  expect(getByText('Team Doe, J')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(
    <TeamProfilePage {...boilerplateProps}>Tab Content</TeamProfilePage>,
  );
  expect(getByText('Tab Content')).toBeVisible();
});
