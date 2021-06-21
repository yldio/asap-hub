import userEvent from '@testing-library/user-event';
import { fireEvent, render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import MultiSelect from '../MultiSelect';
import { ember, pine } from '../../colors';

it('shows the selected value', () => {
  const { getByText } = render(
    <MultiSelect suggestions={['LHR']} values={['LHR']} />,
  );
  expect(getByText('LHR')).toBeVisible();
});

it('when empty shows a placeholder message', () => {
  const { container } = render(
    <MultiSelect suggestions={['LHR']} placeholder="Start typing" />,
  );
  expect(container).toHaveTextContent(/start typing/i);
});

it('shows the no option message when there are no options', () => {
  const { getByDisplayValue, getByText } = render(
    <MultiSelect suggestions={[]} noOptionsMessage={() => 'No options'} />,
  );
  userEvent.type(getByDisplayValue(''), 'LT');
  expect(getByText(/no options/i)).toBeVisible();
});

it('opens a menu to select from on click', () => {
  const handleChange = jest.fn();
  const { getByText, getByDisplayValue } = render(
    <MultiSelect suggestions={['LHR', 'LGW']} onChange={handleChange} />,
  );

  userEvent.click(getByDisplayValue(''));
  userEvent.click(getByText('LGW'));
  expect(handleChange).toHaveBeenLastCalledWith(['LGW']);
});

it('opens a filtered menu to select from when typing', () => {
  const handleChange = jest.fn();
  const { getByText, queryByText, getByDisplayValue } = render(
    <MultiSelect suggestions={['LHR', 'LGW', 'LTN']} onChange={handleChange} />,
  );

  userEvent.type(getByDisplayValue(''), 'LT');
  expect(queryByText('LGW')).not.toBeInTheDocument();

  userEvent.click(getByText('LTN'));
  expect(handleChange).toHaveBeenLastCalledWith(['LTN']);
});

it('does not allow non-suggested input', () => {
  const handleChange = jest.fn();
  const { getByDisplayValue } = render(
    <MultiSelect suggestions={['LHR', 'LGW']} onChange={handleChange} />,
  );
  userEvent.type(getByDisplayValue(''), 'LTN');
  userEvent.tab();
  expect(handleChange).not.toHaveBeenCalled();
});

it('shows the focused suggestion in green', () => {
  const { getByText, getByDisplayValue } = render(
    <MultiSelect suggestions={['LHR', 'LGW']} />,
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

describe('invalidity', () => {
  it('makes the input border red', () => {
    const { getByDisplayValue, rerender } = render(
      <MultiSelect suggestions={['LHR', 'LGW']} values={['LHR']} />,
    );
    expect(
      findParentWithStyle(getByDisplayValue(''), 'borderColor')?.borderColor,
    ).not.toBe(ember.rgb);

    rerender(
      <MultiSelect
        suggestions={['LHR', 'LGW']}
        values={['LHR']}
        customValidationMessage="Nope."
      />,
    );
    expect(
      findParentWithStyle(getByDisplayValue(''), 'borderColor')?.borderColor,
    ).toBe(ember.rgb);
  });
});
