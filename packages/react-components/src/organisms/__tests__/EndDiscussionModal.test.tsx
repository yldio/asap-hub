import { render, screen, fireEvent } from '@testing-library/react';
import EndDiscussionModal from '../EndDiscussionModal';

const mockHandleSubmit = jest.fn();
const mockHandleCancel = jest.fn();

describe('EndDiscussionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with the correct elements', () => {
    render(
      <EndDiscussionModal
        handleSubmit={mockHandleSubmit}
        handleCancel={mockHandleCancel}
      />,
    );

    // Check if headline text is rendered
    expect(
      screen.getByRole('heading', { name: /end discussion and notify\?/i }),
    ).toBeInTheDocument();

    // Check if paragraph text is rendered
    expect(
      screen.getByText(
        /by ending the discussion, the correspondent members on teams and labs will receive a reminder on the crn hub and an email with the latest updates\./i,
      ),
    ).toBeInTheDocument();

    // Check if Cancel button is rendered
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();

    // Check if End Discussion and Notify button is rendered
    expect(
      screen.getByRole('button', { name: /end discussion and notify/i }),
    ).toBeInTheDocument();
  });

  it('calls handleCancel when the Cancel button is clicked', () => {
    render(
      <EndDiscussionModal
        handleSubmit={mockHandleSubmit}
        handleCancel={mockHandleCancel}
      />,
    );

    // Click on the Cancel button
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Assert that handleCancel was called
    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  it('calls handleCancel when the small close button is clicked', () => {
    render(
      <EndDiscussionModal
        handleSubmit={mockHandleSubmit}
        handleCancel={mockHandleCancel}
      />,
    );

    // Click on the small close button (cross icon)
    fireEvent.click(screen.getByTestId('close-button'));

    // Assert that handleCancel was called
    expect(mockHandleCancel).toHaveBeenCalledTimes(1);
  });

  it('calls handleSubmit when the End Discussion and Notify button is clicked', () => {
    render(
      <EndDiscussionModal
        handleSubmit={mockHandleSubmit}
        handleCancel={mockHandleCancel}
      />,
    );

    // Click on the End Discussion and Notify button
    fireEvent.click(
      screen.getByRole('button', { name: /end discussion and notify/i }),
    );

    // Assert that handleSubmit was called
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });
});
