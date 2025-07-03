import { render } from '@testing-library/react';
import { rem } from '../../pixels';

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
