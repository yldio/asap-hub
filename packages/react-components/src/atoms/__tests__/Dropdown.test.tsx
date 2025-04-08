import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { Theme } from '@emotion/react';
import { matchers } from '@emotion/jest';
import { GroupTypeBase, OptionTypeBase, SingleValueProps } from 'react-select';

import { ember, fern, lead, pine, silver, tin } from '../../colors';
import Dropdown from '../Dropdown';
import { reactSelectStyles } from '../../select';

expect.extend(matchers);

it('shows the selected value', () => {
  render(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="LHR" />,
  );

  expect(screen.getByText('Heathrow')).toBeInTheDocument();
});

it('shows a placeholder without a selection', () => {
  const { rerender } = render(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      placeholder="Select"
    />,
  );
  expect(screen.getByText('Select')).toBeVisible();
  expect(getComputedStyle(screen.getByText('Select')).color).toBe(lead.rgb);

  rerender(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      placeholder="Choose something"
    />,
  );

  expect(screen.getByText('Choose something')).toBeVisible();
  expect(getComputedStyle(screen.getByText('Choose something')).color).toBe(
    lead.rgb,
  );
});

it('shows no options message when there are no matching options', () => {
  const { rerender } = render(
    <Dropdown options={[]} value="" placeholder="Select" />,
  );
  userEvent.click(screen.getByText('Select'));
  expect(screen.getByText(/no.+options/i)).toBeVisible();

  rerender(
    <Dropdown
      placeholder="Select"
      options={[]}
      value=""
      noOptionsMessage={(value) => `Not found ${value.inputValue}`}
    />,
  );

  userEvent.type(screen.getByText('Select'), 'll');
  expect(screen.getByText('Not found ll')).toBeVisible();
});

it('allows selecting from a menu with available options', () => {
  const handleChange = jest.fn();
  render(
    <Dropdown
      placeholder="Select"
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      value=""
      onChange={handleChange}
    />,
  );
  const input = screen.getByRole('textbox', { hidden: false });

  userEvent.click(input);
  userEvent.click(screen.getByText('Heathrow'));
  expect(handleChange).toHaveBeenCalledWith('LHR');

  userEvent.click(input);
  userEvent.click(screen.getByText('Gatwick'));
  expect(handleChange).toHaveBeenCalledWith('LGW');
});

it('only shows valid options', () => {
  render(
    <Dropdown
      placeholder="Select"
      options={[
        { value: '', label: '-' },
        { value: 'Heathrow', label: 'Heathrow' },
      ]}
      value=""
    />,
  );

  const input = screen.getByRole('textbox', { hidden: false });
  userEvent.click(input);
  expect(screen.getByText('Heathrow')).toBeVisible();
  expect(screen.queryByText('-')).toBeNull();
});

it('shows the focused option in green', () => {
  render(
    <Dropdown
      placeholder="Select"
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      value=""
    />,
  );

  userEvent.click(screen.getByText('Select'));

  userEvent.hover(screen.getByText('Gatwick'));
  expect(
    findParentWithStyle(screen.getByText('Gatwick'), 'color')?.color.replace(
      / /g,
      '',
    ),
  ).toBe(pine.rgb.replace(/ /g, ''));

  userEvent.hover(screen.getByText('Heathrow'));
  expect(
    findParentWithStyle(screen.getByText('Gatwick'), 'color')?.color.replace(
      / /g,
      '',
    ),
  ).not.toBe(pine.rgb.replace(/ /g, ''));
});

it('gets a green border when focused', () => {
  render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
    />,
  );

  userEvent.click(screen.getByText('Select'));
  expect(
    findParentWithStyle(screen.getByText('Select'), 'borderColor')?.borderColor,
  ).toBe(fern.rgba);

  userEvent.tab();
  expect(
    findParentWithStyle(screen.getByText('Select'), 'borderColor')?.borderColor,
  ).not.toBe(fern.rgb);
});

it('gets greyed out when disabled', () => {
  const { rerender } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      enabled={false}
      value="LHR"
    />,
  );

  expect(
    findParentWithStyle(screen.getByText('Heathrow'), 'color')?.color,
  ).toBe(lead.rgb);
  expect(
    findParentWithStyle(screen.getByText('Heathrow'), 'background')?.background,
  ).toBe(silver.rgb);
  expect(screen.getByRole('textbox')).toBeDisabled();

  rerender(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="LHR" />,
  );
  expect(
    findParentWithStyle(screen.getByText('Heathrow'), 'color')?.color,
  ).not.toBe(lead.rgb);
  expect(
    findParentWithStyle(screen.getByText('Heathrow'), 'background')?.background,
  ).not.toBe(silver.rgb);
  expect(screen.getByRole('textbox')).not.toBeDisabled();
});

it('when invalidated and then option selected it should not display error message', () => {
  const { rerender } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      required={true}
    />,
  );
  expect(
    screen.queryByText('Please fill out this field.'),
  ).not.toBeInTheDocument();
  const input = screen.getByRole('textbox', { hidden: false });
  userEvent.click(input);
  userEvent.tab();

  expect(screen.getByText('Please fill out this field.')).toBeVisible();

  rerender(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value="LHR"
      required={true}
    />,
  );
  expect(
    screen.queryByText('Please fill out this field.'),
  ).not.toBeInTheDocument();
});
it('when invalidated and then rendered optional it should not display error message', () => {
  const { rerender } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      required={true}
    />,
  );
  expect(
    screen.queryByText('Please fill out this field.'),
  ).not.toBeInTheDocument();
  const input = screen.getByRole('textbox', { hidden: false });
  userEvent.click(input);
  userEvent.tab();

  expect(screen.getByText('Please fill out this field.')).toBeVisible();

  rerender(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      required={false}
    />,
  );

  expect(
    screen.queryByText('Please fill out this field.'),
  ).not.toBeInTheDocument();
});
it('when optional and then rendered required it should not display error message', () => {
  const { rerender } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      required={false}
    />,
  );
  expect(
    screen.queryByText('Please fill out this field.'),
  ).not.toBeInTheDocument();

  rerender(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      required={false}
    />,
  );

  expect(
    screen.queryByText('Please fill out this field.'),
  ).not.toBeInTheDocument();
});

it('shows the field in red when required field not filled', () => {
  const handleChange = jest.fn();
  const { rerender } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      required={true}
      value=""
      id="test"
      onChange={handleChange}
    />,
  );
  const input = screen.getByRole('textbox', { hidden: false });
  expect(findParentWithStyle(input, 'color')?.color).not.toBe(ember.rgb);

  userEvent.click(input);
  userEvent.tab();
  expect(findParentWithStyle(input, 'color')?.color).toBe(ember.rgb);

  userEvent.click(input);
  userEvent.type(input, 'Heathrow');
  userEvent.type(input, specialChars.enter);

  expect(handleChange).toHaveBeenCalledWith('LHR');
  rerender(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value="LHR"
      required={false}
    />,
  );
  expect(findParentWithStyle(input, 'color')?.color).not.toBe(ember.rgb);
});

it('shows an error message when required field not filled', async () => {
  const { rerender } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      required
    />,
  );
  const input = screen.getByRole('textbox', { hidden: false });
  userEvent.click(input);
  userEvent.tab();

  expect(screen.getByText('Please fill out this field.')).toBeVisible();

  rerender(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      required
      customValidationMessage={'Please select something'}
    />,
  );

  userEvent.click(input);

  expect(screen.getByText('Please select something')).toBeVisible();
});

it('clears invalid values, when it looses focus', async () => {
  render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
    />,
  );

  userEvent.click(screen.getByText('Select'));
  userEvent.type(screen.getByText('Select'), 'xxx');

  expect(screen.queryByText('Select')).toBeNull();
  expect(screen.getByRole('textbox')).toHaveValue('xxx');

  userEvent.tab();

  await waitFor(() => {
    expect(screen.getByText('Select')).toBeVisible();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});

it('can clear the value when required is false', async () => {
  const handleChange = jest.fn();
  render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LGW', label: 'Gatwick' }]}
      required={false}
      value=""
      id="test"
      onChange={handleChange}
    />,
  );

  const input = screen.getByRole('textbox', { hidden: false });
  userEvent.click(input);
  userEvent.click(screen.getByText('Gatwick'));
  expect(handleChange).toHaveBeenCalledWith('LGW');

  userEvent.clear(input);
  expect(handleChange).toHaveBeenCalledTimes(2);
  expect(handleChange).toHaveBeenCalledWith(undefined);
});
it('cannot clear the value when required is true', async () => {
  const handleChange = jest.fn();
  render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LGW', label: 'Gatwick' }]}
      required={true}
      value=""
      id="test"
      onChange={handleChange}
    />,
  );

  const input = screen.getByRole('textbox', { hidden: false });
  userEvent.click(input);
  userEvent.click(screen.getByText('Gatwick'));
  expect(handleChange).toHaveBeenCalledWith('LGW');

  userEvent.clear(input);
  expect(handleChange).toHaveBeenCalledTimes(1);
});

it('renders custom value using renderValue', () => {
  const CustomValue = ({ value }: { value: string }) => (
    <span data-testid="custom-render">{`Custom: ${value}`}</span>
  );

  render(
    <Dropdown
      options={[{ value: 'value1', label: 'Label-1' }]}
      value="value1"
      renderValue={(value) => <CustomValue value={value} />}
    />,
  );

  // It renders the custom content instead of the label
  expect(screen.getByTestId('custom-render')).toBeInTheDocument();
  expect(screen.getByTestId('custom-render')).toHaveTextContent(
    'Custom: value1',
  );
  expect(screen.queryByText('Label-1')).not.toBeInTheDocument(); // the label should not render
});

it('falls back to label if renderValue is not provided', () => {
  render(
    <Dropdown
      options={[{ value: 'value1', label: 'Label-1' }]}
      value="value1"
    />,
  );

  expect(screen.getByText('Label-1')).toBeInTheDocument();
});

it('applies the correct styles for the custom rendered value', () => {
  render(
    <Dropdown
      options={[{ value: 'value1', label: 'Label-1' }]}
      value="value1"
      renderValue={(value) => (
        <span data-testid="custom-value">Chip: {value}</span>
      )}
    />,
  );

  const customValue = screen.getByTestId('custom-value');
  expect(customValue.parentElement).toHaveStyleRule('position', 'absolute');
  expect(customValue.parentElement).toHaveStyleRule('pointer-events', 'none');
});

const mockTheme = {} as Theme;

const baseProvided = { color: '' };

const createSingleValueProps = (
  value: string,
): SingleValueProps<OptionTypeBase, GroupTypeBase<OptionTypeBase>> =>
  ({
    getValue: () => [{ value, label: '' }],
    hasValue: true,
    isDisabled: false,
    selectProps: {},
    data: { value, label: '' },
  }) as unknown as SingleValueProps<
    OptionTypeBase,
    GroupTypeBase<OptionTypeBase>
  >;

it('applies tin color for singleValue when selected value is empty string', () => {
  const styles = reactSelectStyles(mockTheme, false);
  const styleResult = styles?.singleValue!(
    baseProvided,
    createSingleValueProps(''),
  );
  expect(styleResult?.color).toBe(tin.rgb);
});

it('applies unset color for singleValue when selected value is not empty string', () => {
  const styles = reactSelectStyles(mockTheme, false);
  const styleResult = styles?.singleValue!(
    baseProvided,
    createSingleValueProps('LHR'),
  );
  expect(styleResult?.color).toBe('unset');
});
