import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import FilterPill from '../FilterPill';

describe('FilterPill', () => {
  const value: ComponentProps<typeof FilterPill>['value'] = {
    label: 'Asia',
    typeOfFilter: 'regions',
    id: '0',
  };
  const onRemove = jest.fn();
  it('should render the pill', () => {
    render(<FilterPill value={value} onRemove={onRemove} />);
    expect(screen.getByText('Asia')).toBeVisible();
  });

  it("shows the remove button and it's clickable", () => {
    render(<FilterPill value={value} onRemove={onRemove} />);
    const onRemoveButton = screen.getByRole('button');
    expect(onRemoveButton).toBeVisible();
    userEvent.click(onRemoveButton);
    expect(onRemove).toBeCalledWith(value);
  });
});
