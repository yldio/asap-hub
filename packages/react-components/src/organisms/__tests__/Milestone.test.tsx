import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Milestone as MilestoneType } from '@asap-hub/model';
import Milestone, { getMilestoneStatusAccent } from '../Milestone';

const mockMilestone: MilestoneType = {
  id: '1',
  title: 'Test Milestone',
  description: 'This is a test milestone description',
  status: 'Complete',
};

const longMilestone: MilestoneType = {
  id: '2',
  title: 'Long Milestone',
  description:
    'This is a very long milestone description that exceeds the character limit and should be truncated with a Read More button to allow users to expand and see the full content.',
  status: 'In Progress',
  link: 'https://example.com/milestone',
};

// Mock scrollHeight and clientHeight to simulate truncation
const mockScrollHeight = (element: HTMLElement, scrollHeight: number) => {
  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
};

const mockClientHeight = (element: HTMLElement, clientHeight: number) => {
  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    value: clientHeight,
  });
};

describe('Milestone', () => {
  it('renders milestone description', () => {
    render(<Milestone milestone={mockMilestone} />);
    expect(screen.getByText(mockMilestone.description)).toBeInTheDocument();
  });

  it('renders milestone status pill', () => {
    render(<Milestone milestone={mockMilestone} />);
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('does not render link when not provided', () => {
    render(<Milestone milestone={mockMilestone} />);
    expect(
      screen.queryByRole('link', { name: /view milestone/i }),
    ).not.toBeInTheDocument();
  });

  it('truncates long descriptions and shows Read More button', async () => {
    const { container } = render(<Milestone milestone={longMilestone} />);

    // Find the description div and mock its dimensions to simulate truncation
    const descriptionDiv = container.querySelector(
      'div[class*="descriptionStyles"]',
    );
    if (descriptionDiv) {
      mockScrollHeight(descriptionDiv as HTMLElement, 100);
      mockClientHeight(descriptionDiv as HTMLElement, 48); // 2 lines at 24px line-height

      // Trigger a window resize to force truncation check
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read More/i }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('button', { name: /Read Less/i }),
    ).not.toBeInTheDocument();
  });

  it('expands description when Read More is clicked', async () => {
    const { container } = render(<Milestone milestone={longMilestone} />);

    // Mock dimensions to simulate truncation
    const descriptionDiv = container.querySelector(
      'div[class*="descriptionStyles"]',
    );
    if (descriptionDiv) {
      mockScrollHeight(descriptionDiv as HTMLElement, 100);
      mockClientHeight(descriptionDiv as HTMLElement, 48);

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read More/i }),
      ).toBeInTheDocument();
    });

    const readMoreButton = screen.getByRole('button', { name: /Read More/i });
    await userEvent.click(readMoreButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read Less/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Read More/i }),
      ).not.toBeInTheDocument();
      expect(screen.getByText(longMilestone.description)).toBeInTheDocument();
    });
  });

  it('collapses description when Read Less is clicked', async () => {
    const { container } = render(<Milestone milestone={longMilestone} />);

    // Mock dimensions to simulate truncation
    const descriptionDiv = container.querySelector(
      'div[class*="descriptionStyles"]',
    );
    if (descriptionDiv) {
      mockScrollHeight(descriptionDiv as HTMLElement, 100);
      mockClientHeight(descriptionDiv as HTMLElement, 48);

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read More/i }),
      ).toBeInTheDocument();
    });

    const readMoreButton = screen.getByRole('button', { name: /Read More/i });
    await userEvent.click(readMoreButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read Less/i }),
      ).toBeInTheDocument();
    });

    const readLessButton = screen.getByRole('button', { name: /Read Less/i });
    await userEvent.click(readLessButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read More/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Read Less/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('getMilestoneStatusAccent', () => {
    it('returns success for Complete status', () => {
      expect(getMilestoneStatusAccent('Complete')).toBe('success');
    });

    it('returns info for In Progress status', () => {
      expect(getMilestoneStatusAccent('In Progress')).toBe('info');
    });

    it('returns neutral for Pending status', () => {
      expect(getMilestoneStatusAccent('Pending')).toBe('neutral');
    });

    it('returns warning for Incomplete status', () => {
      expect(getMilestoneStatusAccent('Incomplete')).toBe('warning');
    });

    it('returns error for Not Started status', () => {
      expect(getMilestoneStatusAccent('Not Started')).toBe('error');
    });
  });
});
