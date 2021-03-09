import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Info from '../Info';

it('shows an info icon', () => {
  const { getByTitle } = render(<Info>text</Info>);
  expect(getByTitle(/info/i)).toBeInTheDocument();
});

it('does not show the children by default', () => {
  const { getByText } = render(<Info>text</Info>);
  expect(getByText('text')).not.toBeVisible();
});

it('shows a the children when clicking the info icon', () => {
  const { getByTitle, getByText } = render(<Info>text</Info>);
  userEvent.click(getByTitle(/info/i));
  expect(getByText('text')).toBeVisible();
});
it('reflects the expanded state in the icon', () => {
  const { getByTitle } = render(<Info>text</Info>);
  const { stroke: initialStroke } = findParentWithStyle(
    getByTitle(/info/i),
    'stroke',
  )!;

  userEvent.click(getByTitle(/info/i));
  const { stroke: expandedStroke } = findParentWithStyle(
    getByTitle(/info/i),
    'stroke',
  )!;

  expect(expandedStroke).not.toEqual(initialStroke);
});
