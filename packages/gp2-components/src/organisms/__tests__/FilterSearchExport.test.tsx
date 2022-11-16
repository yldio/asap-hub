import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterSearchExport from '../FilterSearchExport';

describe('FilterSearchExport', () => {
  const defaultProps = {
    isAdministrator: false,
    onFiltersClick: jest.fn(),
    onExportClick: jest.fn(),
  };

  it('renders Filters button', () => {
    render(<FilterSearchExport {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: 'Filter Filters' }),
    ).toBeVisible();
  });
  it('renders the search bar', () => {
    render(<FilterSearchExport {...defaultProps} />);
    expect(screen.getByRole('searchbox')).toBeVisible();
  });
  it('renders the export button if isAdministrator is true', () => {
    const { rerender } = render(
      <FilterSearchExport {...defaultProps} isAdministrator={false} />,
    );
    expect(
      screen.queryByRole('button', { name: 'Export Export' }),
    ).not.toBeInTheDocument();
    rerender(<FilterSearchExport {...defaultProps} isAdministrator={true} />);
    expect(screen.getByRole('button', { name: 'Export Export' })).toBeVisible();
  });

  it('uses the onFilterClick when filters is clicked', () => {
    const mockedOnFiltersClick = jest.fn();
    render(
      <FilterSearchExport
        {...defaultProps}
        onFiltersClick={mockedOnFiltersClick}
      />,
    );
    userEvent.click(screen.getByRole('button', { name: 'Filter Filters' }));
    expect(mockedOnFiltersClick).toHaveBeenCalledTimes(1);
  });
  it('uses the onExportClick when export is clicked', () => {
    const mockedOnExportClick = jest.fn();
    render(
      <FilterSearchExport
        {...defaultProps}
        isAdministrator
        onExportClick={mockedOnExportClick}
      />,
    );
    userEvent.click(screen.getByRole('button', { name: 'Export Export' }));
    expect(mockedOnExportClick).toHaveBeenCalledTimes(1);
  });
});
