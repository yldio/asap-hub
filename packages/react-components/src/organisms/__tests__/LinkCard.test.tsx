import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import LinkCard from '../LinkCard';

const props: ComponentProps<typeof LinkCard> = {
  name: '',
  description: '',
  href: '/wrong',
};
it('renders the title and description', () => {
  const { getByRole, getByText } = render(
    <LinkCard {...props} name="LinkName" description="LinkDescription" />,
  );
  expect(getByRole('heading').textContent).toEqual('LinkName');
  expect(getByRole('heading').tagName).toEqual('H3');
  expect(getByText('LinkDescription')).toBeVisible();
});

it('renders link from properties', () => {
  const { getByText } = render(<LinkCard {...props} href="/link/0" />);
  expect(getByText('Edit Link')).toHaveAttribute('href', '/link/0');
});
