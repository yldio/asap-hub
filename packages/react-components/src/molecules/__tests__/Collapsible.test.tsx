import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Collapsible from '../Collapsible';

it('changes text from show to hide and has max height', () => {
  const { getByText } = render(<Collapsible>text</Collapsible>);
  expect(getByText('text')).toBeVisible();

  expect(
    findParentWithStyle(getByText(/text/i), 'maxHeight')?.maxHeight,
  ).toMatch(/120/i);
  userEvent.click(getByText(/show/i));
  expect(getByText(/hide/i)).toBeVisible();
});
it('changes text from hide to show and removes maxHeight', () => {
  const { getByText } = render(
    <Collapsible initiallyExpanded>text</Collapsible>,
  );
  expect(getByText('text')).toBeVisible();
  expect(
    findParentWithStyle(getByText(/text/i), 'maxHeight')?.maxHeight,
  ).toBeUndefined();
  userEvent.click(getByText(/hide/i));
  expect(getByText(/show/i)).toBeVisible();
});
