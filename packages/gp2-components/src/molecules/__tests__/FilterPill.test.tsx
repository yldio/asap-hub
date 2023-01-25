import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPill from '../FilterPill';

describe('FilterPill', () => {
  beforeEach(jest.resetAllMocks);
  const onRemove = jest.fn();
  it('should render the pill', () => {
    render(<FilterPill onRemove={onRemove}>Asia</FilterPill>);
    expect(screen.getByText('Asia')).toBeVisible();
  });

  it("shows the remove button and it's clickable", () => {
    render(<FilterPill onRemove={onRemove}>Asia</FilterPill>);
    const onRemoveButton = screen.getByRole('button');
    expect(onRemoveButton).toBeVisible();
    userEvent.click(onRemoveButton);
    expect(onRemove).toBeCalled();
  });
});
