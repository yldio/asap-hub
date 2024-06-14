import { fireEvent, render } from '@testing-library/react';

import HoverTable from '../HoverTable';

it('renders table on mouse enter and hides it on mouse out', () => {
  const screen = render(
    <HoverTable header={<span>table header</span>}>
      [<span>table body</span>]
    </HoverTable>,
  );

  const hoverButton = screen.getByRole('button');

  expect(screen.getByText('table header')).not.toBeVisible();

  fireEvent.mouseOver(hoverButton);
  expect(screen.getByText('table header')).toBeVisible();

  fireEvent.mouseOut(hoverButton);
  expect(screen.getByText('table header')).not.toBeVisible();
});

it('renders table body count', () => {
  const screen = render(
    <HoverTable header={<span>table header</span>}>
      {[<span key="child-1">row one</span>, <span key="child-2">row two</span>]}
    </HoverTable>,
  );

  expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
});
