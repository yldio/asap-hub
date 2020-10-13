import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';

import PageCard from '../PageCard';

const props: ComponentProps<typeof PageCard> = {
  title: 'Title',
  text: 'Text',
  href: 'http://localhost/pages/uuid',
};

it('renders the title', () => {
  const { getByRole } = render(<PageCard {...props} />);
  expect(getByRole('heading').textContent).toEqual('Title');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('links to detail page', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/card']}>
      <Route path="/card">
        <PageCard {...props} href="/page" />,
      </Route>
      <Route path="/page">Full Page</Route>
    </MemoryRouter>,
  );

  userEvent.click(getByText('Read more'));
  expect(getByText('Full Page')).toBeVisible();
});
