import { ComponentProps } from 'react';
import {
  createPageResponse,
  createNewsResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { render } from '@testing-library/react';

import DiscoverPageBody from '../DiscoverPageBody';

const props: ComponentProps<typeof DiscoverPageBody> = {
  aboutUs: '<h1>About us content</h1>',
  pages: [createPageResponse('1'), createPageResponse('2')],
  training: [],
  members: [],
  scientificAdvisoryBoard: [],
};

it('renders grantee guidance page cards', () => {
  const { queryAllByRole } = render(
    <DiscoverPageBody {...props} aboutUs={''} />,
  );
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Grantee Guidance', 'Page 1 title', 'Page 2 title']);
});

it('renders about us section', () => {
  const { queryAllByRole, queryByText } = render(
    <DiscoverPageBody {...props} pages={[]} />,
  );

  expect(queryByText('Grantee Guidance')).not.toBeInTheDocument();
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['About us', 'About us content']);
});

it('renders grantee guidance page cards and about us section', () => {
  const { queryAllByRole } = render(<DiscoverPageBody {...props} />);

  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual([
    'Grantee Guidance',
    'Page 1 title',
    'Page 2 title',
    'About us',
    'About us content',
  ]);
});

it('renders training information', () => {
  const { queryAllByRole } = render(
    <DiscoverPageBody
      {...props}
      pages={[]}
      aboutUs={''}
      training={[createNewsResponse('1'), createNewsResponse('2')].map((n) => ({
        ...n,
        href: `/news-and-events/${n.id}`,
      }))}
    />,
  );

  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Training', 'News 1 title', 'News 2 title']);
});

it('renders members information', () => {
  const { queryAllByRole } = render(
    <DiscoverPageBody
      {...props}
      pages={[]}
      aboutUs={''}
      members={[createUserResponse()]}
    />,
  );

  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Meet the team']);
});

it('renders scientific advisory board information', () => {
  const { queryAllByRole } = render(
    <DiscoverPageBody
      {...props}
      pages={[]}
      aboutUs={''}
      scientificAdvisoryBoard={[createUserResponse()]}
    />,
  );

  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Meet the Scientific Advisory Board']);
});
