import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@emotion/react';

import Checkbox from '../Checkbox';
import { color } from '../../colors';

const props: ComponentProps<typeof Checkbox> = {
  groupName: '',
};

it('renders a checkbox', () => {
  const { getByRole } = render(<Checkbox {...props} />);
  expect(getByRole('checkbox')).toBeVisible();
});

it('renders a disabled checkbox', () => {
  const { getByRole } = render(<Checkbox {...props} enabled={false} />);
  expect(getByRole('checkbox')).toBeDisabled();
});

it('fires the select event', async () => {
  const handleChange = jest.fn();
  const { getByRole } = render(<Checkbox {...props} onSelect={handleChange} />);
  expect(handleChange.mock.calls.length).toBe(0);

  userEvent.click(getByRole('checkbox'));
  expect(handleChange.mock.calls.length).toBe(1);
});

it('uses ThemeProvider theme primaryColor', () => {
  const testCheckedBackgroundColor = color(0, 106, 146);
  const theme = {
    colors: {
      primary500: testCheckedBackgroundColor,
    },
  };
  const { getByRole } = render(
    <ThemeProvider theme={theme}>
      <Checkbox {...props} checked />
    </ThemeProvider>,
  );

  const checkbox = getByRole('checkbox');

  const { backgroundColor: checkedBackgroundColor } = getComputedStyle(
    checkbox,
    ':checked',
  );

  expect(checkedBackgroundColor).toBe(testCheckedBackgroundColor.rgb);
});
