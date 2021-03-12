import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Collapsible, { ConditionalCollapsible } from '../Collapsible';

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

describe('Conditional Collapse', () => {
  it('is not collapsible when condition false', () => {
    const { queryByText, getByText } = render(
      <ConditionalCollapsible condition={false}>text</ConditionalCollapsible>,
    );
    expect(getByText('text')).toBeVisible();

    expect(queryByText(/show|hide/i)).toBeNull();
  });
  it('is collapsible when condition true', () => {
    const { getByText, queryByText } = render(
      <ConditionalCollapsible condition>text</ConditionalCollapsible>,
    );
    expect(queryByText('text')).not.toBeVisible();

    userEvent.click(getByText(/show/i));
    expect(getByText('text')).toBeVisible();
  });
});
