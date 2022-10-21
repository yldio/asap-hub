import { render, screen } from '@testing-library/react';
import FilterModalHeader from '../FilterModalHeader';

describe('FilterModalHeader', () => {
  it('renders the title', () => {
    render(<FilterModalHeader numberOfFilter={0}></FilterModalHeader>);
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeVisible();
  });
  it('renders the subtitle with the number of selected filters', () => {
    const { rerender } = render(
      <FilterModalHeader numberOfFilter={0}></FilterModalHeader>,
    );
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    rerender(<FilterModalHeader numberOfFilter={1}></FilterModalHeader>);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
    rerender(<FilterModalHeader numberOfFilter={2}></FilterModalHeader>);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`2 filters`);
  });
});
