import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { enable, disable } from '@asap-hub/flags';
import { ProjectsBanner } from '../ProjectsBanner';

const PROJECTS_BANNER_DISMISSED_KEY = 'crn-projects-banner-dismissed';

describe('ProjectsBanner', () => {
  beforeEach(() => {
    localStorage.removeItem(PROJECTS_BANNER_DISMISSED_KEY);
    enable('PROJECTS_MVP');
  });

  afterEach(() => {
    localStorage.removeItem(PROJECTS_BANNER_DISMISSED_KEY);
    disable('PROJECTS_MVP');
  });

  it('does not render when PROJECTS_MVP flag is disabled', () => {
    disable('PROJECTS_MVP');

    const { container } = render(<ProjectsBanner />);

    expect(container.firstChild).toBeNull();
  });

  it('does not render when banner has been dismissed', () => {
    enable('PROJECTS_MVP');
    localStorage.setItem(PROJECTS_BANNER_DISMISSED_KEY, 'true');

    const { container } = render(<ProjectsBanner />);

    expect(container.firstChild).toBeNull();
  });

  it('renders the banner when flag is enabled and not dismissed', async () => {
    render(<ProjectsBanner />);

    await waitFor(() => {
      expect(screen.getByText(/The Hub is growing!/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Visit the new/i)).toBeInTheDocument();
    expect(screen.getByText(/Projects section/i)).toBeInTheDocument();
    expect(
      screen.getByText(/to discover ongoing work across the network/i),
    ).toBeInTheDocument();
  });

  it('dismisses the banner when close button is clicked', async () => {
    enable('PROJECTS_MVP');
    localStorage.removeItem(PROJECTS_BANNER_DISMISSED_KEY);

    const { container } = render(<ProjectsBanner />);

    await waitFor(() => {
      expect(screen.getByText(/The Hub is growing!/i)).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText('Close');
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });

    // Verify dismissal is stored in localStorage
    expect(localStorage.getItem(PROJECTS_BANNER_DISMISSED_KEY)).toBe('true');
  });

  it('does not render after being dismissed and re-rendered', async () => {
    enable('PROJECTS_MVP');
    localStorage.removeItem(PROJECTS_BANNER_DISMISSED_KEY);

    const { rerender } = render(<ProjectsBanner />);

    await waitFor(() => {
      expect(screen.getByText(/The Hub is growing!/i)).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText('Close');
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/The Hub is growing!/i),
      ).not.toBeInTheDocument();
    });

    // Re-render the component
    rerender(<ProjectsBanner />);

    // Banner should still not be visible
    expect(screen.queryByText(/The Hub is growing!/i)).not.toBeInTheDocument();
  });
});
