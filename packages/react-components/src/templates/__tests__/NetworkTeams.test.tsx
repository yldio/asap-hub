import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NetworkTeams from '../NetworkTeams';

const team: ComponentProps<typeof NetworkTeams>['teams'][0] = {
  id: '42',
  displayName: 'Unknown',
  active: true,
  projectTitle: 'Unknown Project Title',
  members: [],
  expertiseAndResourceTags: [],
  labCount: 0,
};
const teams = [team, { ...team, id: '43', displayName: 'Unknown 2' }];
const props: ComponentProps<typeof NetworkTeams> = {
  teams,
  numberOfItems: teams.length,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: (index) => `#${index}`,
};

it('renders multiple team cards', () => {
  const { queryAllByRole } = render(<NetworkTeams {...props} />);
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Team Unknown', 'Team Unknown 2']);
});
