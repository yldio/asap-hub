import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import FilterPills from '../FilterPills';

describe('FilterPills', () => {
  const values: ComponentProps<typeof FilterPills>['values'] = [
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
    render(<FilterPills values={values} onRemove={onRemove} />);
    expect(screen.getByText('Asia')).toBeVisible();
    expect(screen.getByText('Africa')).toBeVisible();
  });
  it("shows the remove button for the second pill and it's clickable", () => {
    render(<FilterPills values={values} onRemove={onRemove} />);
    const onRemoveButton = screen.getByText('Africa').nextElementSibling!;
    expect(onRemoveButton).toBeVisible();
    userEvent.click(onRemoveButton);
    expect(onRemove).toBeCalledWith(values[1]);
  });
});
