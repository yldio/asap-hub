import { ComponentProps } from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { waitFor } from '@testing-library/dom';

import { ember, fern, pine } from '../../colors';

import MultiSelect from '../MultiSelect';
import { searchIcon } from '../../icons';

it('shows the selected value', () => {
  const { getByText } = render(
    <MultiSelect
      suggestions={[{ label: 'LHR', value: 'LHR' }]}
      values={[{ label: 'LHR', value: 'LHR' }]}
    />,
  );
  expect(getByText('LHR')).toBeVisible();
});

it('when empty shows a placeholder message', () => {
  const { container } = render(
    <MultiSelect
      suggestions={[{ label: 'LHR', value: 'LHR' }]}
      placeholder="Start typing"
    />,
  );
  expect(container).toHaveTextContent(/start typing/i);
});

it('shows left indicator when one is provided', () => {
  const { getByTitle } = render(
    <MultiSelect suggestions={[]} leftIndicator={<div>{searchIcon}</div>} />,
  );
  expect(getByTitle('Search')).toBeInTheDocument();
});

it('shows the no option message when there are no options', async () => {
  const { getByRole, getByText } = render(
    <MultiSelect suggestions={[]} noOptionsMessage={() => 'No options'} />,
  );
  await userEvent.type(getByRole('combobox'), 'LT');
  expect(getByText(/no options/i)).toBeVisible();
});

it('opens a menu to select from on click', async () => {
  const handleChange = jest.fn();
  const { getByText, getByRole } = render(
    <MultiSelect
      suggestions={[
        { label: 'LHR', value: 'LHR' },
        { label: 'LGW', value: 'LGW' },
      ]}
      onChange={handleChange}
    />,
  );

  await userEvent.click(getByRole('combobox'));
  await userEvent.click(getByText('LGW'));
  expect(handleChange).toHaveBeenLastCalledWith(
    [{ label: 'LGW', value: 'LGW' }],
    {
      action: 'select-option',
      name: undefined,
      option: { label: 'LGW', value: 'LGW' },
    },
  );
});

it('opens a menu when clicking a value in react-select v5', async () => {
  const handleChange = jest.fn();
  const { getByText } = render(
    <MultiSelect
      suggestions={[
        { label: 'LHR', value: 'LHR' },
        { label: 'LGW', value: 'LGW' },
      ]}
      values={[{ label: 'LGW', value: 'LGW' }]}
      onChange={handleChange}
    />,
  );

  await userEvent.click(getByText('LGW'));
  // In react-select v5, clicking on a value opens the menu
  await waitFor(() => {
    expect(getByText('LHR')).toBeInTheDocument();
  });
});

it('opens a filtered menu to select from when typing', async () => {
  const handleChange = jest.fn();
  const { getByText, queryByText, getByRole } = render(
    <MultiSelect
      suggestions={[
        { label: 'LHR', value: 'LHR' },
        { label: 'LGW', value: 'LGW' },
        { label: 'LTN', value: 'LTN' },
      ]}
      onChange={handleChange}
    />,
  );

  await userEvent.type(getByRole('combobox'), 'LT');
  expect(queryByText('LGW')).not.toBeInTheDocument();

  await userEvent.click(getByText('LTN'));
  expect(handleChange).toHaveBeenLastCalledWith(
    [{ label: 'LTN', value: 'LTN' }],
    {
      action: 'select-option',
      name: undefined,
      option: { label: 'LTN', value: 'LTN' },
    },
  );
});

it('does not allow non-suggested input', async () => {
  const handleChange = jest.fn();
  const { getByRole } = render(
    <MultiSelect
      suggestions={[
        { label: 'LHR', value: 'LHR' },
        { label: 'LGW', value: 'LGW' },
      ]}
      onChange={handleChange}
    />,
  );
  await userEvent.type(getByRole('combobox'), 'LTN');
  await userEvent.tab();
  expect(handleChange).not.toHaveBeenCalled();
});

it('shows the focused suggestion in green', async () => {
  const { getByText, getByRole } = render(
    <MultiSelect
      suggestions={[
        { label: 'LHR', value: 'LHR' },
        { label: 'LGW', value: 'LGW' },
      ]}
    />,
  );
  await userEvent.click(getByRole('combobox'));
  expect(
    findParentWithStyle(getByText('LGW'), 'color')?.color.replace(/ /g, ''),
  ).not.toBe(pine.rgb.replace(/ /g, ''));

  fireEvent.mouseOver(getByText('LGW'));
  expect(
    findParentWithStyle(getByText('LGW'), 'color')?.color.replace(/ /g, ''),
  ).toBe(pine.rgb.replace(/ /g, ''));
});

describe('invalidity', () => {
  it('shows the error state when input is not focused', () => {
    const { getByRole, getByText } = render(
      <MultiSelect
        suggestions={[
          { label: 'LHR', value: 'LHR' },
          { label: 'LGW', value: 'LGW' },
        ]}
        customValidationMessage="Nope."
      />,
    );

    const input = getByRole('combobox');
    fireEvent.focusIn(input);
    fireEvent.focusOut(input);

    expect(getByText('Nope.')).toBeDefined();
    expect(findParentWithStyle(input, 'borderColor')?.borderColor).toBe(
      ember.rgb,
    );
  });

  it('shows the default state when input is focused', () => {
    const { getByRole, queryByText } = render(
      <MultiSelect
        suggestions={[
          { label: 'LHR', value: 'LHR' },
          { label: 'LGW', value: 'LGW' },
        ]}
      />,
    );
    const input = getByRole('combobox');
    fireEvent.focusIn(input);

    expect(queryByText('Nope.')).toBeNull();
    expect(findParentWithStyle(input, 'borderColor')?.borderColor).toBe(
      fern.rgba,
    );
  });

  it('blurs the multiselect when right clicked (handle right click bug)', async () => {
    const { getByRole, queryByText } = render(
      <MultiSelect
        suggestions={[
          { label: 'LHR', value: 'LHR' },
          { label: 'LGW', value: 'LGW' },
        ]}
      />,
    );
    const input = getByRole('combobox');
    fireEvent.focusIn(input);

    expect(queryByText('Nope.')).toBeNull();
    expect(findParentWithStyle(input, 'borderColor')?.borderColor).toBe(
      fern.rgba,
    );

    const parent = findParentWithStyle(input, 'flexBasis')?.element;
    fireEvent.contextMenu(parent!);

    await waitFor(() => {
      expect(document.activeElement).not.toBe(input);
    });
  });
});

describe('Async', () => {
  const asyncProps: ComponentProps<typeof MultiSelect> = {
    loadOptions: jest.fn(),
    onChange: jest.fn(),
  };
  it('shows the no option message when there are no options', async () => {
    const loadOptionsEmpty = jest.fn().mockResolvedValue([]);
    const { getByRole, getByText, queryByText } = render(
      <MultiSelect
        loadOptions={loadOptionsEmpty}
        noOptionsMessage={() => 'No options'}
      />,
    );
    await userEvent.type(getByRole('combobox'), 'LT');
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(getByText(/no options/i)).toBeVisible();
  });

  it.each`
    isMulti  | calledWith
    ${true}  | ${[{ label: 'One', value: '1' }]}
    ${false} | ${{ label: 'One', value: '1' }}
  `(
    'opens a menu to select from on click when isMulti is $isMulti',
    async ({ isMulti, calledWith }) => {
      const loadOptions = jest.fn().mockResolvedValue([
        { label: 'One', value: '1' },
        { label: 'Two', value: '2' },
      ]);
      const handleChange = jest.fn();
      const { getByText, getByRole, queryByText } = render(
        <MultiSelect
          loadOptions={loadOptions}
          onChange={handleChange}
          isMulti={isMulti}
        />,
      );

      await userEvent.click(getByRole('combobox'));
      await waitFor(() =>
        expect(queryByText(/loading/i)).not.toBeInTheDocument(),
      );
      await userEvent.click(getByText('One'));
      expect(handleChange).toHaveBeenLastCalledWith(
        calledWith,
        expect.anything(),
      );
    },
  );

  it('Will not remove a fixed item with backspace', async () => {
    const mockOnChange = jest.fn();
    const { getByDisplayValue, rerender } = render(
      <MultiSelect
        {...asyncProps}
        onChange={mockOnChange}
        values={[{ label: 'Example', value: '123', isFixed: true }]}
      />,
    );
    fireEvent.keyDown(getByDisplayValue(''), { key: 'Delete' });

    expect(mockOnChange).not.toHaveBeenCalled();

    rerender(
      <MultiSelect
        {...asyncProps}
        onChange={mockOnChange}
        values={[{ label: 'Example', value: '123' }]}
      />,
    );
    fireEvent.keyDown(getByDisplayValue(''), { key: 'Delete' });

    await waitFor(() =>
      expect(mockOnChange).toHaveBeenCalledWith([], {
        action: 'pop-value',
        name: undefined,
        removedValue: { label: 'Example', value: '123' },
      }),
    );
  });

  it('Will not remove a fixed item using remove button', async () => {
    const mockOnChange = jest.fn();
    const { getByTitle, rerender } = render(
      <MultiSelect
        {...asyncProps}
        onChange={mockOnChange}
        values={[{ label: 'Example', value: '123', isFixed: true }]}
      />,
    );
    fireEvent.click(getByTitle('Close').closest('svg')!);

    expect(mockOnChange).not.toHaveBeenCalled();

    rerender(
      <MultiSelect
        {...asyncProps}
        onChange={mockOnChange}
        values={[{ label: 'Example', value: '123' }]}
      />,
    );
    fireEvent.click(getByTitle('Close').closest('svg')!);

    await waitFor(() =>
      expect(mockOnChange).toHaveBeenCalledWith([], {
        action: 'remove-value',
        name: undefined,
        removedValue: { label: 'Example', value: '123' },
      }),
    );
  });

  it('shows an error message when required field not filled', async () => {
    const mockOnChange = jest.fn();
    const { rerender, getByRole, getByText, queryByText } = render(
      <MultiSelect
        {...asyncProps}
        values={[]}
        onChange={mockOnChange}
        getValidationMessage={() => 'Please fill out this field.'}
        required
      />,
    );
    const input = getByRole('combobox');
    await userEvent.click(input);
    await userEvent.tab();

    expect(getByText('Please fill out this field.')).toBeVisible();

    rerender(
      <MultiSelect
        {...asyncProps}
        onChange={mockOnChange}
        values={[{ label: 'Example', value: '123' }]}
        getValidationMessage={() => 'Please fill out this field.'}
        required
      />,
    );

    await userEvent.click(input);
    expect(queryByText('Please fill out this field.')).not.toBeInTheDocument();
  });

  it('supports adding new options', async () => {
    const mockOnChange = jest.fn();

    const { queryByText, getByText, getByRole } = render(
      <MultiSelect
        loadOptions={jest
          .fn()
          .mockResolvedValue([{ label: 'Example', value: '123' }])}
        creatable={true}
        onChange={mockOnChange}
      />,
    );

    await userEvent.click(getByRole('combobox'));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await userEvent.type(getByRole('combobox'), 'Test');
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await waitFor(() => expect(getByText('Test')).toBeInTheDocument());
    await userEvent.click(getByText('Test'));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            value: 'Test',
            label: 'Test',
          }),
        ],
        {
          action: 'create-option',
          name: undefined,
          option: { __isNew__: true, label: 'Test', value: 'Test' },
        },
      );
    });
  });
});
