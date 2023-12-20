import { fireEvent, render, waitFor } from '@testing-library/react';

import CopyButton from '../CopyButton';

const onClick = jest.fn();
it('renders a button with copy icon', () => {
  const screen = render(
    <CopyButton
      onClick={onClick}
      hoverTooltipText="Hover Text"
      clickTooltipText="Click Text"
    />,
  );
  expect(screen.getByTitle('Copy')).toBeInTheDocument();
});

it('renders hover text on mouse enter and hides it on out', () => {
  const screen = render(
    <CopyButton
      onClick={onClick}
      hoverTooltipText="Hover Text"
      clickTooltipText="Click Text"
    />,
  );

  const copyButton = screen.getByRole('button', { name: 'Copy' });

  expect(screen.getByText('Hover Text')).not.toBeVisible();

  fireEvent.mouseOver(copyButton);
  expect(screen.getByText('Hover Text')).toBeVisible();

  fireEvent.mouseOut(copyButton);
  expect(screen.getByText('Hover Text')).not.toBeVisible();
});

it('renders click text when user clicks the button', async () => {
  const screen = render(
    <CopyButton
      onClick={onClick}
      hoverTooltipText="Hover Text"
      clickTooltipText="Click Text"
    />,
  );

  const copyButton = screen.getByRole('button', { name: 'Copy' });

  expect(screen.getByText('Click Text')).not.toBeVisible();

  fireEvent.click(copyButton);
  expect(screen.getByText('Click Text')).toBeVisible();

  await waitFor(
    () => expect(screen.getByText('Click Text')).not.toBeVisible(),
    { timeout: 20000 },
  );
}, 30000);
