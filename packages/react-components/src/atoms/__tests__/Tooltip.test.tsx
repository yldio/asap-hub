import { render } from '@testing-library/react';
import { rem, tabletScreen } from '../../pixels';
import { colour } from '../../colors';

import Tooltip from '../Tooltip';

it('does not show the children by default', () => {
  const { getByText } = render(<Tooltip>text</Tooltip>);
  expect(getByText('text')).not.toBeVisible();
});

it('shows a tooltip with the children when shown', () => {
  const { getByRole, getByText } = render(<Tooltip shown>text</Tooltip>);
  expect(getByText('text')).toBeVisible();
  expect(getByRole('tooltip')).toHaveTextContent('text');
});

it('applies width as rem when width is a number', () => {
  const width = 34;
  const { getByRole } = render(
    <Tooltip shown width={width}>
      text
    </Tooltip>,
  );
  expect(getByRole('tooltip').parentElement).toHaveStyle({
    width: rem(width),
  });
});

it('recolours the bubble and its tail when a background is given', () => {
  const { getByRole } = render(
    <Tooltip shown background="rgb(0, 32, 44)">
      text
    </Tooltip>,
  );

  const bubble = getByRole('tooltip');
  expect(bubble.parentElement).toHaveStyleRule(
    '--tooltip-background',
    'rgb(0, 32, 44)',
  );
  expect(bubble).toHaveStyleRule(
    'background-color',
    'var(--tooltip-background)',
  );
  expect(bubble.parentElement).toHaveStyleRule(
    'border-top',
    '4px solid var(--tooltip-background)',
    { target: '::before' },
  );
});

it('keeps the default background when none is given', () => {
  const { getByRole } = render(<Tooltip shown>text</Tooltip>);
  expect(getByRole('tooltip').parentElement).toHaveStyleRule(
    '--tooltip-background',
    colour.foreground['color-blue'],
  );
});

it('places the bubble at the given offset from its anchor', () => {
  const { getByRole } = render(
    <Tooltip shown offset={rem(24)}>
      text
    </Tooltip>,
  );
  expect(getByRole('tooltip').parentElement).toHaveStyle({ bottom: rem(24) });
});

it('renders the text in Nunito Sans', () => {
  const { getByText } = render(<Tooltip shown>text</Tooltip>);
  expect(getByText('text')).toHaveStyleRule(
    'font-family',
    expect.stringMatching(/^'Nunito Sans', ?Roboto/),
  );
});

it('keeps the tooltip within the screen width below the tablet breakpoint', () => {
  const { getByRole } = render(<Tooltip shown>text</Tooltip>);
  expect(getByRole('tooltip').parentElement).toHaveStyleRule(
    'max-width',
    `calc(100vw - ${rem(48)})`,
    { media: `(max-width: ${tabletScreen.width - 1}px)` },
  );
});

it('renders the bubble below its anchor with the tail on top when positioned at the bottom', () => {
  const { getByRole } = render(
    <Tooltip shown position="bottom" background="rgb(0, 32, 44)">
      text
    </Tooltip>,
  );

  const tooltip = getByRole('tooltip').parentElement;
  expect(tooltip).toHaveStyle({ top: rem(4) });
  expect(tooltip).toHaveStyleRule(
    'border-bottom',
    '4px solid var(--tooltip-background)',
    { target: '::before' },
  );
});
