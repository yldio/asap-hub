import userEvent from '@testing-library/user-event';
import { fireEvent, render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Typeahead from '../Typeahead';
import { ember, lead, pine, silver } from '../../colors';

it('shows the selected value', () => {
  const { getByDisplayValue } = render(
    <Typeahead suggestions={['LHR']} value="LHR" />,
  );
  expect(getByDisplayValue('LHR')).toBeVisible();
});

it('when empty shows a placeholder message', () => {
  const { container } = render(<Typeahead suggestions={['LHR']} value="" />);
  expect(container).toHaveTextContent(/start typing/i);
});

it('opens a menu to select from on click', () => {
  const handleChange = jest.fn();
  const { getByText, getByDisplayValue } = render(
    <Typeahead suggestions={['LHR', 'LGW']} value="" onChange={handleChange} />,
  );

  userEvent.click(getByDisplayValue(''));
  userEvent.click(getByText('LGW'));
  expect(handleChange).toHaveBeenLastCalledWith('LGW');
});

it('opens a filtered menu to select from when typing', () => {
  const handleChange = jest.fn();
  const { getByText, queryByText, getByDisplayValue } = render(
    <Typeahead
      suggestions={['LHR', 'LGW', 'LTN']}
      value=""
      onChange={handleChange}
    />,
  );

  userEvent.type(getByDisplayValue(''), 'LT');
  expect(queryByText('LGW')).not.toBeInTheDocument();

  userEvent.click(getByText('LTN'));
  expect(handleChange).toHaveBeenLastCalledWith('LTN');
});

it('allows non-suggested input', () => {
  const handleChange = jest.fn();
  const { getByDisplayValue } = render(
    <Typeahead suggestions={['LHR', 'LGW']} value="" onChange={handleChange} />,
  );
  userEvent.type(getByDisplayValue(''), 'LTN');
  expect(handleChange).toHaveBeenLastCalledWith('LTN');
});

it('shows the focused suggestion in green', () => {
  const { getByText, getByDisplayValue } = render(
    <Typeahead suggestions={['LHR', 'LGW']} value="" />,
  );
  userEvent.click(getByDisplayValue(''));
  expect(
    findParentWithStyle(getByText('LGW'), 'color')?.color.replace(/ /g, ''),
  ).not.toBe(pine.rgb.replace(/ /g, ''));

  fireEvent.mouseOver(getByText('LGW'));
  expect(
    findParentWithStyle(getByText('LGW'), 'color')?.color.replace(/ /g, ''),
  ).toBe(pine.rgb.replace(/ /g, ''));
});

it('gets greyed out when disabled', () => {
  const { getByRole, getByText, rerender } = render(
    <Typeahead suggestions={['LHR', 'LGW']} value="LHR" enabled={false} />,
  );
  expect(findParentWithStyle(getByText('LHR'), 'color')?.color).toBe(lead.rgb);
  expect(findParentWithStyle(getByText('LHR'), 'background')?.background).toBe(
    silver.rgb,
  );
  expect(getByRole('textbox')).toBeDisabled();

  rerender(<Typeahead suggestions={['LHR', 'LGW']} value="LHR" />);
  expect(findParentWithStyle(getByText('LHR'), 'color')?.color).not.toBe(
    lead.rgb,
  );
  expect(
    findParentWithStyle(getByText('LHR'), 'background')?.background,
  ).not.toBe(silver.rgb);
  expect(getByRole('textbox')).not.toBeDisabled();
});

describe('invalidity', () => {
  it('makes the value red', () => {
    const { getByText, rerender } = render(
      <Typeahead suggestions={['LHR', 'LGW']} value="LHR" />,
    );
    expect(findParentWithStyle(getByText('LHR'), 'color')?.color).not.toBe(
      ember.rgb,
    );

    rerender(
      <Typeahead
        suggestions={['LHR', 'LGW']}
        value="LHR"
        customValidationMessage="Nope."
      />,
    );
    expect(findParentWithStyle(getByText('LHR'), 'color')?.color).toBe(
      ember.rgb,
    );
  });

  it('is caused by being empty when required', () => {
    const { getByDisplayValue } = render(
      <Typeahead suggestions={['LHR', 'LGW']} value="LHR" required />,
    );
    userEvent.clear(getByDisplayValue('LHR'));
    userEvent.tab();
    expect(findParentWithStyle(getByDisplayValue(''), 'color')?.color).toBe(
      ember.rgb,
    );
  });
});
