import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPills from '../FilterPills';

describe('FilterPills', () => {
  const values = [
    {
      label: 'A pill',
      id: 'pill-0',
    },
    {
      label: 'A second pill',
      id: 'pill-1',
    },
  ];
  const onRemove = jest.fn();
  it('should render all the pills', () => {
    render(<FilterPills values={values} onRemove={onRemove} />);
    expect(screen.getByText('A pill')).toBeInTheDocument();
    expect(screen.getByText('A second pill')).toBeInTheDocument();
  });
  it('should appear the remove button for the second pill and be clickable', () => {
    render(<FilterPills values={values} onRemove={onRemove} />);
    const onRemoveButton =
      screen.getByText('A second pill').nextElementSibling!;
    userEvent.click(onRemoveButton);
    expect(onRemove).toBeCalledWith({
      label: 'A second pill',
      id: 'pill-1',
    });
  });
});
