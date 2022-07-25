import { ComponentProps } from 'react';
import { createPageResponse, createUserResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';

import DiscoverPageBody from '../DiscoverPageBody';

const props: ComponentProps<typeof DiscoverPageBody> = {
  aboutUs: '<h1>About us content</h1>',
  pages: [createPageResponse('1'), createPageResponse('2')],
  training: [],
  members: [],
  scientificAdvisoryBoard: [],
  workingGroups: [],
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

it('renders members section', () => {
  const { queryAllByRole } = render(
    <DiscoverPageBody {...props} members={[createUserResponse()]} />,
  );

  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual([
    'Grantee Guidance',
    'Page 1 title',
    'Page 2 title',
    'About us',
    'About us content',
    'Meet the ASAP team',
  ]);
});
it('renders scientific Advisory Board section', () => {
  const { queryAllByRole } = render(
    <DiscoverPageBody
      {...props}
      scientificAdvisoryBoard={[createUserResponse()]}
    />,
  );

  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual([
    'Grantee Guidance',
    'Page 1 title',
    'Page 2 title',
    'About us',
    'About us content',
    'Meet the Scientific Advisory Board',
  ]);
});
