import { ComponentProps } from 'react';
import { createPageResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';

import DiscoverPageBody from '../DiscoverPageBody';

const props: ComponentProps<typeof DiscoverPageBody> = {
  aboutUs: '',
  pages: [],
  training: [],
  members: [],
  scientificAdvisoryBoard: [],
  workingGroups: [],
};

it('renders grantee guidance page cards', () => {
  const { queryAllByRole } = render(
    <DiscoverPageBody
      {...props}
      pages={[
        { ...createPageResponse('1'), title: 'Example 1 Title' },
        { ...createPageResponse('2'), title: 'Example 2 Title' },
      ]}
    />,
  );
  expect(
    queryAllByRole('heading', { level: 4 }).map(
      ({ textContent }) => textContent,
    ),
  ).toEqual(['Example 1 Title', 'Example 2 Title']);
});
