import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EngagementSort, { EngagementSortProps } from '../EngagementSort';

const onClickOption1 = jest.fn();
const onClickOption2 = jest.fn();
const sortingOptions = [
  {
    key: '1',
    iconTitle: 'Icon 1',
    label: 'Option 1',
    onClick: onClickOption1,
    Icon: jest.fn(() => <div data-testid="icon1" />),
  },
  {
    key: '2',
    iconTitle: 'Icon 2',
    label: 'Option 2',
    onClick: onClickOption2,
    Icon: jest.fn(() => <div data-testid="icon2" />),
  },
];

const defaultProps: EngagementSortProps = {
  isActive: false,
  description: '',
  sortingOptions,
};

describe('EngagementSort', () => {
  it('should render the sorting icon button', () => {
    render(<EngagementSort {...defaultProps} />);
    expect(screen.getByTitle(/General Sort Icon/i)).toBeInTheDocument();
  });

  it('should toggle the menu when the button is clicked', () => {
    render(<EngagementSort {...defaultProps} />);

    expect(screen.getByText(/option 1/i)).not.toBeVisible();

    const sortButton = screen.getByTitle(/General Sort Icon/i);
    userEvent.click(sortButton);

    expect(screen.getByText(/option 1/i)).toBeVisible();
  });

  it('should close the menu when clicking outside', () => {
    render(<EngagementSort {...defaultProps} />);

    const sortButton = screen.getByTitle(/General Sort Icon/i);
    userEvent.click(sortButton);

    expect(screen.getByText(/option 1/i)).toBeVisible();

    fireEvent.mouseDown(document);
    expect(screen.getByText(/option 1/i)).not.toBeVisible();
  });

  it('should close the menu when pressing Escape key', () => {
    render(<EngagementSort {...defaultProps} />);
    const sortButton = screen.getByTitle(/General Sort Icon/i);
    userEvent.click(sortButton);

    expect(screen.getByText(/option 1/i)).toBeVisible();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByText(/option 1/i)).not.toBeVisible();
  });

  it('should call the onClick and close the menu when clicking a sorting option', () => {
    render(<EngagementSort {...defaultProps} />);
    const sortButton = screen.getByTitle(/General Sort Icon/i);
    userEvent.click(sortButton);

    const option = screen.getByText(/option 1/i);
    userEvent.click(option);
    expect(onClickOption1).toHaveBeenCalled();
    expect(screen.getByText(/option 1/i)).not.toBeVisible();
  });
});
