import { render, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Dropdown, { ENTER_KEYCODE } from '../Dropdown';
import { ember, fern, pine, lead, silver } from '../../colors';

it('shows the selected value', () => {
  const { getByRole } = render(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="LHR" />,
  );

  expect(getByRole('textbox')).toHaveValue('Heathrow');
});

it('shows a placeholder without a selection', () => {
  const { getByText, rerender } = render(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      placeholder="Select"
    />,
  );
  expect(getByText('Select')).toBeVisible();
  expect(getComputedStyle(getByText('Select')).color).toBe(lead.rgb);

  rerender(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      placeholder="Choose something"
    />,
  );

  expect(getByText('Choose something')).toBeVisible();
  expect(getComputedStyle(getByText('Choose something')).color).toBe(lead.rgb);
});

it('shows no options message when there are no matching options', () => {
  const { getByText, rerender } = render(
    <Dropdown options={[]} value="" placeholder="Select" />,
  );
  userEvent.click(getByText('Select'));
  expect(getByText(/no.+options/i)).toBeVisible();

  rerender(
    <Dropdown
      placeholder="Select"
      options={[]}
      value=""
      noOptionsMessage={(value) => `Not found ${value.inputValue}`}
    />,
  );

  userEvent.type(getByText('Select'), 'll');
  expect(getByText('Not found ll')).toBeVisible();
});

it('allows selecting from a menu with available options', () => {
  const handleChange = jest.fn();
  const { getByText } = render(
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

  userEvent.click(getByText('Select'));
  userEvent.click(getByText('Heathrow'));
  expect(handleChange).toHaveBeenCalledWith('LHR');

  userEvent.click(getByText('Select'));
  userEvent.click(getByText('Gatwick'));
  expect(handleChange).toHaveBeenCalledWith('LGW');
});

it('only shows valid options', () => {
  const { getByText, queryByText } = render(
    <Dropdown
      placeholder="Select"
      options={[
        { value: '', label: '-' },
        { value: 'Heathrow', label: 'Heathrow' },
      ]}
      value=""
    />,
  );

  userEvent.click(getByText('Select'));
  expect(getByText('Heathrow')).toBeVisible();
  expect(queryByText('-')).toBeNull();
});

it('shows the focused option in green', () => {
  const { getByText } = render(
    <Dropdown
      placeholder="Select"
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      value=""
    />,
  );

  userEvent.click(getByText('Select'));

  fireEvent.mouseOver(getByText('Gatwick'));
  expect(
    findParentWithStyle(getByText('Gatwick'), 'color')?.color.replace(/ /g, ''),
  ).toBe(pine.rgb.replace(/ /g, ''));

  fireEvent.mouseOver(getByText('Heathrow'));
  expect(
    findParentWithStyle(getByText('Gatwick'), 'color')?.color.replace(/ /g, ''),
  ).not.toBe(pine.rgb.replace(/ /g, ''));
});

it('gets a green border when focused', () => {
  const { getByText } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
    />,
  );

  userEvent.click(getByText('Select'));
  expect(
    findParentWithStyle(getByText('Select'), 'borderColor')?.borderColor,
  ).toBe(fern.rgb);

  userEvent.tab();
  expect(
    findParentWithStyle(getByText('Select'), 'borderColor')?.borderColor,
  ).not.toBe(fern.rgb);
});

it('gets greyed out when disabled', () => {
  const { getByRole, getByText, rerender } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      enabled={false}
      value="LHR"
    />,
  );

  expect(findParentWithStyle(getByText('Heathrow'), 'color')?.color).toBe(
    lead.rgb,
  );
  expect(
    findParentWithStyle(getByText('Heathrow'), 'background')?.background,
  ).toBe(silver.rgb);
  expect(getByRole('textbox')).toBeDisabled();

  rerender(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="LHR" />,
  );
  expect(findParentWithStyle(getByText('Heathrow'), 'color')?.color).not.toBe(
    lead.rgb,
  );
  expect(
    findParentWithStyle(getByText('Heathrow'), 'background')?.background,
  ).not.toBe(silver.rgb);
  expect(getByRole('textbox')).not.toBeDisabled();
});

it('shows the field in red when required field not filled', async () => {
  const { getByText, getByRole, rerender } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      required={true}
      value=""
    />,
  );

  userEvent.click(getByText('Select'));
  userEvent.tab();
  expect(findParentWithStyle(getByRole('textbox'), 'color')?.color).toBe(
    ember.rgb,
  );

  rerender(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      placeholder="Select"
    />,
  );
  userEvent.click(getByText('Select'));
  userEvent.tab();
  expect(findParentWithStyle(getByRole('textbox'), 'color')?.color).not.toBe(
    ember.rgb,
  );
});

it('shows an error message when required field not filled', () => {
  const { getByText, getByRole, rerender } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      required
    />,
  );
  userEvent.click(getByText('Select'));
  userEvent.tab();

  expect(getByText('Please fill out this field.')).toBeVisible();
  expect(getByRole('textbox')).toBeRequired();

  rerender(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      required
      getValidationMessage={() => 'Please select something'}
    />,
  );

  userEvent.click(getByText('Select'));
  userEvent.tab();

  expect(getByText('Please select something')).toBeVisible();
  expect(getByRole('textbox')).toBeRequired();
});

it('clears invalid values, when it looses focus', async () => {
  const { getByText, getByRole, queryByText } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
    />,
  );

  userEvent.click(getByText('Select'));
  userEvent.type(getByText('Select'), 'xxx');

  expect(queryByText('Select')).toBeNull();
  expect(getByRole('textbox')).toHaveValue('xxx');

  userEvent.tab();

  await waitFor(() => {
    expect(getByText('Select')).toBeVisible();
    expect(getByRole('textbox')).toHaveValue('');
  });
});

it('clears invalid values, when enter', async () => {
  const { getByText, getByRole, queryByText } = render(
    <Dropdown
      placeholder="Select"
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
    />,
  );

  userEvent.click(getByText('Select'));
  userEvent.type(getByText('Select'), 'xxx');

  expect(queryByText('Select')).toBeNull();
  expect(getByRole('textbox')).toHaveValue('xxx');

  fireEvent.keyDown(getByRole('textbox'), {
    keyCode: ENTER_KEYCODE,
  });

  await waitFor(() => {
    expect(getByText('Select')).toBeVisible();
    expect(getByRole('textbox')).toHaveValue('');
  });
});

it('Shows all options when it focus after selecting particular option', () => {
  const handleChange = jest.fn();
  const { getByRole, getByText, queryByText } = render(
    <Dropdown
      placeholder="Select"
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
        { value: 'FRA', label: 'Frankfurt' },
      ]}
      value=""
      onChange={handleChange}
    />,
  );

  userEvent.click(getByText('Select'));
  userEvent.type(getByText('Select'), 'Heathrow');

  expect(queryByText('Select')).toBeNull();
  expect(getByRole('textbox')).toHaveValue('Heathrow');

  fireEvent.keyDown(getByRole('textbox'), {
    keyCode: ENTER_KEYCODE,
  });

  expect(handleChange).toHaveBeenCalledWith('LHR');

  userEvent.click(getByText('Heathrow'));
  expect(getByText('Gatwick')).toBeVisible();
  expect(getByText('Frankfurt')).toBeVisible();
});
