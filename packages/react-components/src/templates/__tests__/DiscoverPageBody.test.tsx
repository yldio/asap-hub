import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import DiscoverPageBody from '../DiscoverPageBody';

const props: ComponentProps<typeof DiscoverPageBody> = {
  aboutUs: '<h3>About us content</h3>',
  pages: [
    {
      path: '/',
      title: 'Page 1 Title',
      text: 'Page 1 Text',
    },
    {
      path: '/',
      title: 'Page 2 Title',
      text: 'Page 2 Text',
    },
  ],
  members: [],
};

it('renders multiple page cards', () => {
  const { queryAllByRole } = render(
    <DiscoverPageBody {...props} aboutUs={''} />,
  );
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Grantee Guidance', 'Page 1 Title', 'Page 2 Title']);
});

it('renders about us section only when there is content', () => {
  const { queryAllByRole } = render(<DiscoverPageBody {...props} />);

  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual([
    'Grantee Guidance',
    'Page 1 Title',
    'Page 2 Title',
    'About us',
    'About us content',
  ]);
});

it('renders about us section when there are no pages', () => {
  const { queryAllByRole, queryByText } = render(
    <DiscoverPageBody {...props} pages={[]} />,
  );

  expect(queryByText('Grantee Guidance')).not.toBeInTheDocument();
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['About us', 'About us content']);
});
