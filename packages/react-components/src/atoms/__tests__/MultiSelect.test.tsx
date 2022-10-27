import { ComponentProps, RefObject } from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { waitFor } from '@testing-library/dom';

import Select from 'react-select';
import {
  // @ts-expect-error sortableController is used to handle the mock
  sortableController,
  SortableContainerProps,
  SortEndHandler,
} from 'react-sortable-hoc';
import { ember, fern, pine } from '../../colors';

import MultiSelect, { arrayMove } from '../MultiSelect';
import { noop } from '../../utils';

interface SortableMock {
  onSortEnd?: SortEndHandler;
  getHelperDimensions?: SortableContainerProps['getHelperDimensions'];
}

jest.mock('react-sortable-hoc', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
  const React = require('react');
  const controller: SortableMock = {
    onSortEnd: undefined,
    getHelperDimensions: undefined,
  };

  return {
    sortableController: controller,
    SortableContainer: (
      Component: React.ComponentType<{ ref: RefObject<unknown> }>,
    ) =>
      React.forwardRef(
        (
          props: {
            onSortEnd: SortEndHandler;
            getHelperDimensions: SortableContainerProps['getHelperDimensions'];
          },
          ref: RefObject<unknown>,
        ) => {
          controller.onSortEnd = props.onSortEnd;
          controller.getHelperDimensions = props.getHelperDimensions;
          return <Component {...props} ref={ref} />;
        },
      ),
    SortableHandle: (id: React.ComponentType) => id,
    SortableElement: (id: React.ComponentType) => id,
  };
});

describe('Sorting elements', () => {
  it('can sort elements', () => {
    const onChange = jest.fn();
    const value1 = { label: 'LHR', value: 'LHR' };
    const value2 = { label: 'RHL', value: 'RHL' };
    render(
      <MultiSelect
        suggestions={[]}
        values={[value1, value2]}
        onChange={onChange}
      />,
    );

    sortableController.onSortEnd({ oldIndex: 0, newIndex: 1 });
    expect(onChange).toHaveBeenCalledWith([value2, value1]);
  });

  it('getHelperDimensions calls getBoundingClientRect', () => {
    render(<MultiSelect suggestions={[]} values={[]} onChange={noop} />);

    const getBoundingClientRect = jest.fn();
    sortableController.getHelperDimensions({ node: { getBoundingClientRect } });
    expect(getBoundingClientRect).toHaveBeenCalled();
  });

  describe('arrayMove', () => {
    it('can insert at the start', () => {
      expect(arrayMove([1, 2, 3], 2, 0)).toEqual([3, 1, 2]);
    });
    it('can insert at the end', () => {
      expect(arrayMove([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
    });
  });
});

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
    <MultiSelect
      suggestions={[
        { label: 'LHR', value: 'LHR' },
        { label: 'LGW', value: 'LGW' },
      ]}
      onChange={handleChange}
    />,
  );

  userEvent.click(getByDisplayValue(''));
  userEvent.click(getByText('LGW'));
  expect(handleChange).toHaveBeenLastCalledWith([
    { label: 'LGW', value: 'LGW' },
  ]);
});

it('does not open a menu when clicking a value', () => {
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

  userEvent.click(getByText('LGW'));
  expect(() => getByText('LHR')).toThrowError();
});

it('opens a filtered menu to select from when typing', () => {
  const handleChange = jest.fn();
  const { getByText, queryByText, getByDisplayValue } = render(
    <MultiSelect
      suggestions={[
        { label: 'LHR', value: 'LHR' },
        { label: 'LGW', value: 'LGW' },
        { label: 'LTN', value: 'LTN' },
      ]}
      onChange={handleChange}
    />,
  );

  userEvent.type(getByDisplayValue(''), 'LT');
  expect(queryByText('LGW')).not.toBeInTheDocument();

  userEvent.click(getByText('LTN'));
  expect(handleChange).toHaveBeenLastCalledWith([
    { label: 'LTN', value: 'LTN' },
  ]);
});

it('does not allow non-suggested input', () => {
  const handleChange = jest.fn();
  const { getByDisplayValue } = render(
    <MultiSelect
      suggestions={[
        { label: 'LHR', value: 'LHR' },
        { label: 'LGW', value: 'LGW' },
      ]}
      onChange={handleChange}
    />,
  );
  userEvent.type(getByDisplayValue(''), 'LTN');
  userEvent.tab();
  expect(handleChange).not.toHaveBeenCalled();
});

it('shows the focused suggestion in green', () => {
  const { getByText, getByDisplayValue } = render(
    <MultiSelect
      suggestions={[
        { label: 'LHR', value: 'LHR' },
        { label: 'LGW', value: 'LGW' },
      ]}
    />,
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

    const input = getByRole('textbox');
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
        customValidationMessage="Nope."
      />,
    );
    const input = getByRole('textbox');
    fireEvent.focusIn(input);

    expect(queryByText('Nope.')).toBeNull();
    expect(findParentWithStyle(input, 'borderColor')?.borderColor).toBe(
      fern.rgba,
    );
  });

  it('blurs the multiselect when right clicked (handle right click bug)', async () => {
    const blurSelect = jest.spyOn(Select.prototype, 'blur');
    const { getByRole, queryByText } = render(
      <MultiSelect
        suggestions={[
          { label: 'LHR', value: 'LHR' },
          { label: 'LGW', value: 'LGW' },
        ]}
        customValidationMessage="Nope."
      />,
    );
    const input = getByRole('textbox');
    fireEvent.focusIn(input);

    expect(queryByText('Nope.')).toBeNull();
    expect(findParentWithStyle(input, 'borderColor')?.borderColor).toBe(
      fern.rgba,
    );

    const parent = findParentWithStyle(input, 'flexBasis')?.element;
    fireEvent.contextMenu(parent!);
    expect(blurSelect).toHaveBeenCalledTimes(1);
  });
});

describe('Async', () => {
  const asyncProps: ComponentProps<typeof MultiSelect> = {
    loadOptions: jest.fn(),
    onChange: jest.fn(),
  };
  it('shows the no option message when there are no options', async () => {
    const loadOptionsEmpty = jest.fn().mockResolvedValue([]);
    const { getByDisplayValue, getByText, queryByText } = render(
      <MultiSelect
        loadOptions={loadOptionsEmpty}
        noOptionsMessage={() => 'No options'}
      />,
    );
    userEvent.type(getByDisplayValue(''), 'LT');
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(getByText(/no options/i)).toBeVisible();
  });
  it('opens a menu to select from on click', async () => {
    const loadOptions = jest.fn().mockResolvedValue([
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
    ]);
    const handleChange = jest.fn();
    const { getByText, getByDisplayValue, queryByText } = render(
      <MultiSelect loadOptions={loadOptions} onChange={handleChange} />,
    );

    userEvent.click(getByDisplayValue(''));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    userEvent.click(getByText('One'));
    expect(handleChange).toHaveBeenLastCalledWith([
      { label: 'One', value: '1' },
    ]);
  });

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

    await waitFor(() => expect(mockOnChange).toHaveBeenCalledWith([]));
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

    await waitFor(() => expect(mockOnChange).toHaveBeenCalledWith([]));
  });

  it('supports adding new options', async () => {
    const mockOnChange = jest.fn();

    const { queryByText, getAllByText, getByDisplayValue, rerender } = render(
      <MultiSelect
        {...asyncProps}
        placeholder={'type something'}
        loadOptions={() =>
          Promise.resolve([{ label: 'Example', value: '123' }])
        }
        sortable={false}
      />,
    );

    userEvent.click(getByDisplayValue(''));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    userEvent.type(getByDisplayValue(''), 'Test');
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    expect(getAllByText('Test')).toHaveLength(1);

    rerender(
      <MultiSelect
        {...asyncProps}
        loadOptions={jest
          .fn()
          .mockResolvedValue([{ label: 'Example', value: '123' }])}
        creatable={true}
        onChange={mockOnChange}
      />,
    );

    userEvent.click(getByDisplayValue(''));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    userEvent.type(getByDisplayValue(''), 'Test');
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    userEvent.click(getAllByText('Test')[1]);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        expect.objectContaining({
          value: 'Test',
          label: 'Test',
        }),
      ]);
    });
  });
});
