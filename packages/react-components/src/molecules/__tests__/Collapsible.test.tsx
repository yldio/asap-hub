import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Collapsible from '../Collapsible';

it('changes text from show to hide', () => {
  const { getByText } = render(<Collapsible>text</Collapsible>);
  expect(getByText('text')).toBeVisible();

  userEvent.click(getByText(/show/i));
  expect(getByText(/hide/i)).toBeVisible();
});
it('changes text from hide to show', () => {
  const { getByText } = render(
    <Collapsible initiallyExpanded>text</Collapsible>,
  );
  expect(getByText('text')).toBeVisible();

  userEvent.click(getByText(/hide/i));
  expect(getByText(/show/i)).toBeVisible();
});
