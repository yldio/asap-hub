import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { ember, fern, lead, pine, silver } from '../../colors';
import Dropdown from '../Dropdown';

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
  ).toBe(fern.rgb);

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

it('shows the field in red when required field not filled', async () => {
  render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      required={true}
      value=""
      id="test"
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

  waitFor(() =>
    expect(findParentWithStyle(input, 'color')?.color).not.toBe(ember.rgb),
  );
});

it('shows an error message when required field not filled', () => {
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
      getValidationMessage={() => 'Please select something'}
    />,
  );

  userEvent.click(input);
  userEvent.tab();

  waitFor(() =>
    expect(screen.getByText('Please select something')).toBeVisible(),
  );
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

it('clears invalid values, when enter', async () => {
  render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
    />,
  );

  const input = screen.getByRole('textbox', { hidden: false });
  userEvent.click(input);
  userEvent.type(input, 'xxx');

  expect(screen.getByRole('textbox')).toHaveValue('xxx');

  userEvent.type(input, specialChars.enter);

  expect(input).toBeVisible();
  waitFor(() => expect(input).toHaveValue(''));
});

it('clears the field in red when rerendered correctly', async () => {
  const { rerender } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      required={true}
      value=""
      id="test"
    />,
  );
  const input = screen.getByRole('textbox', { hidden: false });
  expect(findParentWithStyle(input, 'color')?.color).not.toBe(ember.rgb);

  userEvent.click(input);
  userEvent.tab();
  expect(findParentWithStyle(input, 'color')?.color).toBe(ember.rgb);

  rerender(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      required={true}
      value=""
      id="test"
    />,
  );

  waitFor(() =>
    expect(findParentWithStyle(input, 'color')?.color).not.toBe(ember.rgb),
  );
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
  expect(handleChange).toBeCalledTimes(2);
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
  expect(handleChange).toBeCalledTimes(1);
});
