import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createPageResponse } from '@asap-hub/fixtures';

import PageCard from '../PageCard';

const props: ComponentProps<typeof PageCard> = createPageResponse('1');

it('renders the title', () => {
  const { getByRole } = render(<PageCard {...props} />);
  expect(getByRole('heading').textContent).toEqual('Page 1 title');
  expect(getByRole('heading').tagName).toEqual('H4');
});

it('renders link from properties', () => {
  const { getByRole } = render(<PageCard {...props} link={'#'} />);

  expect(getByRole('link')).toHaveAttribute('href', '#');
});
