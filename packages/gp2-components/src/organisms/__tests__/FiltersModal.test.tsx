import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltersModal } from '../..';

describe('FiltersModal', () => {
  const defaultProps = {
    onBackClick: jest.fn(),
    onApplyClick: jest.fn(),
    filters: {},
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders the header', () => {
    render(<FiltersModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeVisible();
  });
  it('renders the footer', () => {
    render(<FiltersModal {...defaultProps} />);
    expect(
      screen.getAllByRole('button').map((button) => button.textContent),
    ).toEqual(expect.arrayContaining(['Close', 'Reset', 'Apply']));
  });
  it.each(['Expertise / Interests', 'Regions', 'Working Groups', 'Projects'])(
    'renders the %s input field',
    (fieldName) => {
      render(<FiltersModal {...defaultProps} />);
      expect(screen.getByRole('textbox', { name: fieldName })).toBeVisible();
    },
  );
  it('calls the onBackClick function on close', () => {
    render(<FiltersModal {...defaultProps} />);
    const closeButton = screen.getAllByRole('button', { name: 'Close' })[1];
    expect(closeButton).toBeVisible();
    userEvent.click(closeButton);
    expect(defaultProps.onBackClick).toHaveBeenCalledTimes(1);
  });
  it('calls the onApplyClick function on apply', () => {
    render(<FiltersModal {...defaultProps} />);
    const applyButton = screen.getByRole('button', { name: 'Apply' });
    expect(applyButton).toBeVisible();
    userEvent.click(applyButton);
    expect(defaultProps.onApplyClick).toHaveBeenCalledTimes(1);
  });
  it('resets selected filters on Reset', () => {
    render(<FiltersModal {...defaultProps} />);
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const regionsField = screen.getByRole('textbox', { name: 'Regions' });
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    expect(resetButton).toBeVisible();
    userEvent.click(regionsField);
    userEvent.click(screen.getByText('Asia'));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
    userEvent.click(resetButton);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
  });
});
