import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LinkCard from '../LinkCard';

const props: ComponentProps<typeof LinkCard> = {
  name: '',
  description: '',
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
  const onClick = jest.fn();
  const { getByText } = render(<LinkCard {...props} onClick={onClick} />);
  userEvent.click(getByText('Edit Link'));
  expect(onClick).toHaveBeenCalled();
});
