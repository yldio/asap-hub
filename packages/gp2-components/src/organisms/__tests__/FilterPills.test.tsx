import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import FilterPills from '../FilterPills';

describe('FilterPills', () => {
  beforeEach(jest.resetAllMocks);
  const pills: ComponentProps<typeof FilterPills>['pills'] = [
    {
      label: 'Asia',
      typeOfFilter: 'regions',
      id: '0',
    },
    {
      label: 'Africa',
      typeOfFilter: 'regions',
      id: '1',
    },
  ];
  const onRemove = jest.fn();
  it('should render all the pills', () => {
    render(<FilterPills pills={pills} onRemove={onRemove} />);
    expect(screen.getByText('Asia')).toBeVisible();
    expect(screen.getByText('Africa')).toBeVisible();
  });
  it("shows the remove button for the second pill and it's clickable", () => {
    render(<FilterPills pills={pills} onRemove={onRemove} />);
    const onRemoveButton = within(screen.getByText('Africa')).getByRole(
      'button',
    );
    expect(onRemoveButton).toBeVisible();
    userEvent.click(onRemoveButton);
    expect(onRemove).toBeCalledWith(pills[1].id, pills[1].typeOfFilter);
  });
});
