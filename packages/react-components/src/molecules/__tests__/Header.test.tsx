import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Header from '../Header';

it('renders an ASAP logo', () => {
  const { getByAltText } = render(<Header />);
  expect(getByAltText(/asap.+logo/i)).toHaveAttribute(
    'src',
    expect.stringMatching(/asap/i),
  );
});

it('links back to the home page', () => {
  const { getByAltText, container } = render(
    <MemoryRouter initialEntries={['/page']}>
      <Route exact path="/page" component={Header} />
      <Route exact path="/" render={() => 'home'} />
    </MemoryRouter>,
  );

  userEvent.click(getByAltText(/asap.+logo/i));
  expect(container).toHaveTextContent('home');
});

it('does not render an opaque background when set to transparent', () => {
  const { getByAltText, rerender } = render(<Header />);
  expect(
    findParentWithStyle(getByAltText(/asap.+logo/i), 'backgroundColor')
      ?.backgroundColor,
  ).toMatchInlineSnapshot(`"rgb(255, 255, 255)"`);

  rerender(<Header transparent />);
  expect(
    findParentWithStyle(getByAltText(/asap.+logo/i), 'backgroundColor'),
  ).toBe(null);
});
