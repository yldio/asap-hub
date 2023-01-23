import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPill from '../FilterPill';

describe('FilterPill', () => {
  const value = {
    label: 'A pill',
    id: 'pill-0',
  };
  const onRemove = jest.fn();
  it('should render the pill', () => {
    render(<FilterPill value={value} onRemove={onRemove} />);
    expect(screen.getByText('A pill')).toBeVisible();
  });

  it('shows the remove button and be clickable', () => {
    render(<FilterPill value={value} onRemove={onRemove} />);
    const onRemoveButton = screen.getByRole('button');
    userEvent.click(onRemoveButton);
    expect(onRemove).toBeCalledWith({
      label: 'A pill',
      id: 'pill-0',
    });
  });
});
