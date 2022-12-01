import { gp2 as gp2Model } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltersModal } from '../..';

const { userRegions, keywords } = gp2Model;

describe('FiltersModal', () => {
  const defaultProps = {
    onBackClick: jest.fn(),
    onApplyClick: jest.fn(),
    filters: {},
  };
  const getRegionsField = () =>
    screen.getByRole('textbox', { name: 'Regions' });
  const getExpertiseField = () =>
    screen.getByRole('textbox', { name: 'Expertise / Interests' });
  beforeEach(jest.resetAllMocks);
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
  it.each(userRegions)('%s region is selectable', (region) => {
    render(<FiltersModal {...defaultProps} />);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    userEvent.click(getRegionsField());
    userEvent.click(screen.getByText(region));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
  });
  it('renders the no options message for regions', () => {
    render(<FiltersModal {...defaultProps} />);
    userEvent.type(getRegionsField(), 'LT');
    expect(
      screen.getByText(/sorry, no current regions match "lt"/i),
    ).toBeVisible();
  });
  it.each(keywords)('%s expertise is selectable', (keyword) => {
    render(<FiltersModal {...defaultProps} />);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    userEvent.click(getExpertiseField());
    userEvent.click(screen.getByText(keyword));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
  });
  it('renders the no options message for expertise', () => {
    render(<FiltersModal {...defaultProps} />);
    userEvent.type(getExpertiseField(), 'LT');
    expect(
      screen.getByText(/sorry, no current expertise \/ interests match "lt"/i),
    ).toBeVisible();
  });
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
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    expect(resetButton).toBeVisible();
    userEvent.click(getRegionsField());
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
