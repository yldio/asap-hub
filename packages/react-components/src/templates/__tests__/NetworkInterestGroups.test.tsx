import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NetworkGroups from '../NetworkInterestGroups';

const props: ComponentProps<typeof NetworkGroups> = {
  interestGroups: [
    {
      id: '0',
      name: 'Group 0',
      tags: [],
      description: 'Desc 0',
      numberOfTeams: 1,
      active: true,
    },
    {
      id: '1',
      name: 'Group 1',
      tags: [],
      description: 'Desc 1',
      numberOfTeams: 1,
      active: true,
    },
  ],
  numberOfItems: 2,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: (index) => `#${index}`,
};

it('renders one group card per group', async () => {
  const { getAllByRole } = render(
    <NetworkGroups
      {...props}
      interestGroups={[
        { ...props.interestGroups[0]!, name: 'Group 0' },
        { ...props.interestGroups[1]!, name: 'Group 1' },
      ]}
    />,
  );
  expect(getAllByRole('heading').map(({ textContent }) => textContent)).toEqual(
    ['Group 0', 'Group 1'],
  );
});
