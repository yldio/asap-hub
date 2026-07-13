import { fireEvent, render } from '@testing-library/react';

import RailTooltip from '../RailTooltip';

const renderTooltip = (props: Partial<{ enabled: boolean }> = {}) =>
  render(
    <RailTooltip label="Network" {...props}>
      <button type="button">icon</button>
    </RailTooltip>,
  );

it('shows the label on hover and hides it on leave', () => {
  const { getByText, getByRole, queryByRole } = renderTooltip();
  const wrapper = getByText('icon').parentElement!;

  expect(queryByRole('tooltip')).not.toBeInTheDocument();
  fireEvent.mouseEnter(wrapper);
  expect(getByRole('tooltip')).toHaveTextContent('Network');
  fireEvent.mouseLeave(wrapper);
  expect(queryByRole('tooltip')).not.toBeInTheDocument();
});

it('shows the label on keyboard focus and hides it on blur', () => {
  const { getByText, getByRole, queryByRole } = renderTooltip();
  const wrapper = getByText('icon').parentElement!;
  jest
    .spyOn(wrapper, 'matches')
    .mockImplementation((selector: string) => selector === ':focus-visible');

  fireEvent.focus(wrapper);
  expect(getByRole('tooltip')).toHaveTextContent('Network');
  fireEvent.blur(wrapper);
  expect(queryByRole('tooltip')).not.toBeInTheDocument();
});

it('does not show on non-keyboard focus', () => {
  const { getByText, queryByRole } = renderTooltip();
  const wrapper = getByText('icon').parentElement!;
  jest.spyOn(wrapper, 'matches').mockReturnValue(false);

  fireEvent.focus(wrapper);
  expect(queryByRole('tooltip')).not.toBeInTheDocument();
});

it('never shows when disabled', () => {
  const { getByText, queryByRole } = renderTooltip({ enabled: false });
  const wrapper = getByText('icon').parentElement!;

  fireEvent.mouseEnter(wrapper);
  expect(queryByRole('tooltip')).not.toBeInTheDocument();
});
