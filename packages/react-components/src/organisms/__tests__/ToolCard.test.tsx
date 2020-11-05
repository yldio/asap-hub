import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import ToolCard from '../ToolCard';

const props: ComponentProps<typeof ToolCard> = {
  name: '',
  description: '',
  href: '/wrong',
  url: 'http://example.com',
};
it('renders the title and description', () => {
  const { getByRole, getByText } = render(
    <ToolCard {...props} name="LinkName" description="LinkDescription" />,
  );
  expect(getByRole('heading').textContent).toEqual('LinkName');
  expect(getByRole('heading').tagName).toEqual('H3');
  expect(getByText('LinkDescription')).toBeVisible();
});

it('renders link from properties', () => {
  const { getByText } = render(<ToolCard {...props} href="/link/0" />);
  expect(getByText('Edit Link')).toHaveAttribute('href', '/link/0');
});
