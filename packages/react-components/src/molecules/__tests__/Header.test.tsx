import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Header from '../Header';

it('renders an ASAP logo', () => {
  const { getByTitle } = render(<Header />);
  expect(getByTitle('ASAP Logo')).toBeInTheDocument();
});

it('links back to the home page', () => {
  const { getByTitle, container } = render(
    <MemoryRouter initialEntries={['/page']}>
      <Route exact path="/page" component={Header} />
      <Route exact path="/" render={() => 'home'} />
    </MemoryRouter>,
  );

  userEvent.click(getByTitle('ASAP Logo'));
  expect(container).toHaveTextContent('home');
});

it('does not render an opaque background when set to transparent', () => {
  const { getByTitle, rerender } = render(<Header />);
  expect(
    findParentWithStyle(getByTitle('ASAP Logo'), 'backgroundColor')
      ?.backgroundColor,
  ).toMatchInlineSnapshot(`"rgb(255, 255, 255)"`);

  rerender(<Header transparent />);
  expect(findParentWithStyle(getByTitle('ASAP Logo'), 'backgroundColor')).toBe(
    null,
  );
});

it('enables the header link when user is onboarded', () => {
  const { container, rerender } = render(<Header enabled={true} />);
  expect(container.querySelector('a')).toHaveAttribute('href', '/');

  rerender(<Header enabled={false} />);
  expect(container.querySelector('a')).not.toHaveAttribute('href', '');
});
