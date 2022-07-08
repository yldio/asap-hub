import { createNewsResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';

import DiscoverTutorials from '../DiscoverTutorials';

const props: ComponentProps<typeof DiscoverTutorials> = {
  training: [],
};

it('renders the title and subtitle', () => {
  render(<DiscoverTutorials {...props} />);
  expect(screen.getByText(/tutorials/i, { selector: 'h3' })).toBeVisible();
  expect(screen.getByText(/Explore our tutorials/i)).toBeVisible();
});

it('renders tutorial items', () => {
  render(
    <DiscoverTutorials
      {...props}
      training={[
        createNewsResponse('First One', 'Tutorial'),
        createNewsResponse('Second One', 'Tutorial'),
      ]}
    />,
  );
  expect(screen.getByText(/First One/, { selector: 'h4' })).toBeVisible();
  expect(screen.getByText(/Second One/, { selector: 'h4' })).toBeVisible();
});
