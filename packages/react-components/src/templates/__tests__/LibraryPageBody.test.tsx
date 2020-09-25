import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import LibraryPageBody from '../LibraryPageBody';

const props: Omit<ComponentProps<typeof LibraryPageBody>, 'children'> = {
  researchOutput: [
    {
      id: '1',
      title: 'Output 1',
      type: 'proposal',
      href: '#',
      publishDate: new Date().toISOString(),
      created: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Output 2',
      type: 'proposal',
      href: '#',
      publishDate: new Date().toISOString(),
      created: new Date().toISOString(),
    },
  ],
};

it('renders multiple library cards', () => {
  const { queryAllByRole } = render(<LibraryPageBody {...props} />);
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Output 1', 'Output 2']);
});
