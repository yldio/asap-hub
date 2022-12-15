import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NetworkWorkingGroups from '../NetworkWorkingGroups';

const props: ComponentProps<typeof NetworkWorkingGroups> = {
  workingGroups: [
    {
      id: '42',
      title: 'My Working Group',
      externalLink: 'https://www.google.com',
      shortText: 'My Working Group Description',
      lastModifiedDate: '2020-01-1',
      complete: false,
    },
    {
      id: '42',
      title: 'My Working Group',
      externalLink: 'https://www.google.com',
      shortText: 'My Working Group Description',
      lastModifiedDate: '2020-01-1',
      complete: false,
    },
  ],
  numberOfItems: 2,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: (index) => `#${index}`,
};

it('renders one group card per group', async () => {
  const { getAllByRole } = render(
    <NetworkWorkingGroups
      {...props}
      workingGroups={[
        { ...props.workingGroups[0], title: 'Working Group 0' },
        { ...props.workingGroups[1], title: 'Working Group 1' },
      ]}
    />,
  );
  expect(getAllByRole('heading').map(({ textContent }) => textContent)).toEqual(
    ['Working Group 0', 'Working Group 1'],
  );
});
