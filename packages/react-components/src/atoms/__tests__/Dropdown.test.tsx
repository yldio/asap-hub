import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Dropdown from '../Dropdown';
import { ember, tin, fern, pine, lead, silver } from '../../colors';

it('shows the selected value', () => {
  const { getByText } = render(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="LHR" />,
  );
  expect(getByText('Heathrow')).toBeVisible();
});

it('without options shows a placeholder message', () => {
  const { getByText } = render(
    <Dropdown options={[{ value: '', label: '-' }]} value="" />,
  );
  userEvent.click(getByText('-'));

  expect(getByText(/no.+options/i)).toBeVisible();
});

it('allows selecting from a menu with available options', () => {
  const handleChange = jest.fn();
  const { getByText } = render(
    <Dropdown
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      value="LHR"
      onChange={handleChange}
    />,
  );
  userEvent.click(getByText('Heathrow'));
  userEvent.click(getByText('Gatwick'));

  expect(handleChange).toHaveBeenCalledWith('LGW');
});

it('shows the focused option in green', () => {
  const { getByText } = render(
    <Dropdown
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      value="LHR"
    />,
  );
  userEvent.click(getByText('Heathrow'));
  expect(
    findParentWithStyle(getByText('Gatwick'), 'color')?.color.replace(/ /g, ''),
  ).not.toBe(pine.rgb.replace(/ /g, ''));

  fireEvent.mouseOver(getByText('Gatwick'));
  expect(
    findParentWithStyle(getByText('Gatwick'), 'color')?.color.replace(/ /g, ''),
  ).toBe(pine.rgb.replace(/ /g, ''));
});

it('shows the placeholder for a missing selection greyed out', () => {
  const { getByText, rerender } = render(
    <Dropdown
      options={[
        { value: '', label: '-' },
        { value: 'LHR', label: 'Heathrow' },
      ]}
      value="LHR"
    />,
  );
  expect(getComputedStyle(getByText('Heathrow')).color).not.toBe(tin.rgb);

  rerender(
    <Dropdown
      options={[
        { value: '', label: '-' },
        { value: 'LHR', label: 'Heathrow' },
      ]}
      value=""
    />,
  );
  expect(getComputedStyle(getByText('-')).color).toBe(tin.rgb);
});

it('shows the value in red when invalid', () => {
  const { getByText, rerender } = render(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="LHR" />,
  );
  expect(findParentWithStyle(getByText('Heathrow'), 'color')?.color).not.toBe(
    ember.rgb,
  );

  rerender(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value="LHR"
      customValidationMessage="Nope."
    />,
  );
  expect(findParentWithStyle(getByText('Heathrow'), 'color')?.color).toBe(
    ember.rgb,
  );
});

it('gets a green border when focused', () => {
  const { getByText } = render(
    <Dropdown options={[{ value: 'LHR', label: 'Heathrow' }]} value="LHR" />,
  );
  expect(
    findParentWithStyle(
      getByText('Heathrow'),
      'borderColor',
    )?.borderColor.replace(/ /g, ''),
  ).not.toBe(fern.rgb.replace(/ /g, ''));

  userEvent.tab();
  expect(
    findParentWithStyle(
      getByText('Heathrow'),
      'borderColor',
    )?.borderColor.replace(/ /g, ''),
  ).toBe(fern.rgb.replace(/ /g, ''));
});

it('shows the dropdown grey out', () => {
  const { getByRole, getByText, rerender } = render(
    <Dropdown
      options={[{ value: 'LHR', label: 'Heathrow' }]}
      value="LHR"
      enabled={false}
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
