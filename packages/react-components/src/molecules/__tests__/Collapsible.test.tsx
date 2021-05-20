import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Collapsible from '../Collapsible';

it('does not show its children by default', () => {
  const { queryByText } = render(<Collapsible>text</Collapsible>);
  expect(queryByText('text')).not.toBeVisible();
});
it('shows its children by default when initiallyExpanded', () => {
  const { getByText } = render(
    <Collapsible initiallyExpanded>text</Collapsible>,
  );
  expect(getByText('text')).toBeVisible();
});

it('shows its children when clicking show', () => {
  const { getByText, queryByText } = render(<Collapsible>text</Collapsible>);
  expect(queryByText('text')).not.toBeVisible();

  userEvent.click(getByText(/show/i));
  expect(getByText('text')).toBeVisible();
});
it('hides its children when clicking hide', () => {
  const { getByText, queryByText } = render(
    <Collapsible initiallyExpanded>text</Collapsible>,
  );
  expect(getByText('text')).toBeVisible();

  userEvent.click(getByText(/hide/i));
  expect(queryByText('text')).not.toBeVisible();
});
