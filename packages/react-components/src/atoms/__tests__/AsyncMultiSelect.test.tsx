import userEvent from '@testing-library/user-event';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import AsyncSelect from 'react-select/async';
import { fern } from '../../colors';
import AsyncMultiSelect from '../AsyncMultiSelect';

const loadOptions = jest.fn();
loadOptions.mockReturnValue(
  new Promise((resolve) =>
    resolve([
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
    ]),
  ),
);

it('shows the selected value', () => {
  const { getByText } = render(
    <AsyncMultiSelect
      loadOptions={loadOptions}
      values={[{ label: 'One', value: '1' }]}
    />,
  );
  expect(getByText('One')).toBeVisible();
});

it('when empty shows a placeholder message', () => {
  const { container } = render(
    <AsyncMultiSelect loadOptions={loadOptions} placeholder="Start typing" />,
  );
  expect(container).toHaveTextContent(/start typing/i);
});

it('shows the no option message when there are no options', async () => {
  const loadOptionsEmpty = jest.fn();
  loadOptionsEmpty.mockReturnValue(new Promise((resolve) => resolve([])));
  const { getByDisplayValue, getByText, queryByText } = render(
    <AsyncMultiSelect
      loadOptions={loadOptionsEmpty}
      noOptionsMessage={() => 'No options'}
    />,
  );
  userEvent.type(getByDisplayValue(''), 'LT');
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());
  expect(getByText(/no options/i)).toBeVisible();
});

it('opens a menu to select from on click', async () => {
  const handleChange = jest.fn();
  const { getByText, getByDisplayValue, queryByText } = render(
    <AsyncMultiSelect loadOptions={loadOptions} onChange={handleChange} />,
  );

  userEvent.click(getByDisplayValue(''));
  await waitFor(() => expect(queryByText(/loading/i)).not.toBeInTheDocument());
  userEvent.click(getByText('One'));
  expect(handleChange).toHaveBeenLastCalledWith([{ label: 'One', value: '1' }]);
});

it('blurs the Asyncmultiselect when right clicked (handle right click bug)', async () => {
  const blurSelect = jest.spyOn(AsyncSelect.prototype, 'blur');
  const { getByRole } = render(<AsyncMultiSelect loadOptions={loadOptions} />);
  const input = getByRole('textbox');
  fireEvent.focusIn(input);

  expect(findParentWithStyle(input, 'borderColor')?.borderColor).toBe(fern.rgb);

  const parent = findParentWithStyle(input, 'flexBasis')?.element;
  fireEvent.contextMenu(parent!);
  await waitFor(() => expect(blurSelect).toHaveBeenCalledTimes(1));
});
