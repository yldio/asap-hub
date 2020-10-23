import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import LibraryPageBody from '../LibraryPageBody';

const props: Omit<ComponentProps<typeof LibraryPageBody>, 'children'> = {
  researchOutputs: [
    {
      id: '1',
      title: 'Output 1',
      type: 'Proposal',
      href: '#',
      publishDate: new Date().toISOString(),
      created: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Output 2',
      type: 'Proposal',
      href: '#',
      publishDate: new Date().toISOString(),
      created: new Date().toISOString(),
    },
  ],
  numberOfItems: 2,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: (index) => `#${index}`,
};

it('renders multiple library cards', () => {
  const { queryAllByRole } = render(<LibraryPageBody {...props} />);
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Output 1', 'Output 2']);
});
