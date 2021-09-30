import { render, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Dropdown from '../Dropdown';
import { ember, fern, pine, lead, silver } from '../../colors';

it('shows the selected value', () => {
  const { getByDisplayValue } = render(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="LHR" />,
  );

  expect(getByDisplayValue('LHR')).toBeVisible();
});

it('without selection shows a placeholder', () => {
  const { getByText, rerender } = render(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      placeholder="Choose something"
    />,
  );
  expect(getByText('Choose something')).toBeVisible();
  expect(getComputedStyle(getByText('Choose something')).color).toBe(lead.rgb);

  rerender(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="" />,
  );
  expect(getByText('Select')).toBeVisible();
  expect(getComputedStyle(getByText('Select')).color).toBe(lead.rgb);
});

it('without options shows a placeholder message that can be customized', () => {
  const { getByText, rerender } = render(<Dropdown options={[]} value="" />);
  userEvent.click(getByText('Select'));
  expect(getByText(/no.+options/i)).toBeVisible();

  rerender(
    <Dropdown options={[]} value="" noOptionsMessage={(a) => 'Not found LL'} />,
  );

  userEvent.click(getByText('Select'));
  userEvent.type(getByText('Select'), 'll');
  expect(getByText('Not found LL')).toBeVisible();
});

it('allows selecting from a menu with available options', () => {
  const handleChange = jest.fn();
  const { getByText } = render(
    <Dropdown
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
      options={[
        { value: '', label: '-' },
        { value: 'Heathrow', label: 'Heathrow' },
      ]}
      value=""
    />,
  );

  userEvent.click(getByText('Select'));
  expect(getByText('Heathrow')).toBeDefined();
  expect(queryByText('-')).toBeNull();
});

it('shows the focused option in green', () => {
  const { getByText } = render(
    <Dropdown
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

it('shows a list of valid values', () => {
  const { queryByText, getByText } = render(
    <Dropdown options={[{ value: '', label: '' }]} value="" />,
  );

  userEvent.click(getByText('Select'));
  expect(queryByText('No options')).toBeVisible();
});

it('gets a green border when focused', () => {
  const { getByText, getByRole } = render(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="LHR" />,
  );

  userEvent.click(getByText('LHR'));
  expect(
    findParentWithStyle(getByRole('textbox'), 'borderColor')?.borderColor,
  ).toBe(fern.rgb);

  userEvent.tab();
  expect(
    findParentWithStyle(getByRole('textbox'), 'borderColor')?.borderColor,
  ).not.toBe(fern.rgb);
});

it('gets greyed out when disabled', () => {
  const { getByRole, getByText, rerender } = render(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value="LHR"
      enabled={false}
    />,
  );

  expect(findParentWithStyle(getByText('LHR'), 'color')?.color).toBe(lead.rgb);
  expect(findParentWithStyle(getByText('LHR'), 'background')?.background).toBe(
    silver.rgb,
  );
  expect(getByRole('textbox')).toBeDisabled();

  rerender(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="LHR" />,
  );
  expect(findParentWithStyle(getByText('LHR'), 'color')?.color).not.toBe(
    lead.rgb,
  );
  expect(
    findParentWithStyle(getByText('LHR'), 'background')?.background,
  ).not.toBe(silver.rgb);
  expect(getByRole('textbox')).not.toBeDisabled();
});

it('shows the value in red when invalid', () => {
  const { getByText, rerender } = render(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="LHR" />,
  );
  expect(findParentWithStyle(getByText('LHR'), 'color')?.color).not.toBe(
    ember.rgb,
  );

  rerender(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value="LHR"
      customValidationMessage="Nope."
    />,
  );
  expect(findParentWithStyle(getByText('LHR'), 'color')?.color).toBe(ember.rgb);
});

it('shows an error message when required field not filled', () => {
  const { getByText, getByRole } = render(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value=""
      required
    />,
  );
  userEvent.click(getByText('Select'));
  userEvent.tab();

  expect(getByText('Please fill out this field.')).toBeVisible();
  expect(getByRole('textbox')).toBeRequired();
});

it('shows an error message  when required field has invalid value', async () => {
  const { getByText, getByRole } = render(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      customValidationMessage={'Please select something'}
      value=""
      required
    />,
  );

  expect(getByRole('textbox')).toBeRequired();

  userEvent.click(getByText('Select'));
  userEvent.type(getByText('Select'), 'xxx');
  fireEvent.focusOut(getByText('xxx'));

  await waitFor(() => {
    expect(getByText(/no.+options/i)).toBeVisible();
    expect(getByText('Please select something')).toBeVisible();
  });
});

it('clears invalid values, when it looses focus', async () => {
  const { getByText, getByRole, queryByText } = render(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="" />,
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
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="" />,
  );

  userEvent.click(getByText('Select'));
  userEvent.type(getByText('Select'), 'xxx');

  expect(queryByText('Select')).toBeNull();
  expect(getByRole('textbox')).toHaveValue('xxx');

  fireEvent.keyDown(getByRole('textbox'), {
    keyCode: 13,
  });

  await waitFor(() => {
    expect(getByText('Select')).toBeVisible();
    expect(getByRole('textbox')).toHaveValue('');
  });
});
