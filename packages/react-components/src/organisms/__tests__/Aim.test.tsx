import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Aim as AimType, AimStatus } from '@asap-hub/model';
import Aim, { getAimStatusAccent } from '../Aim';

const mockAim: AimType = {
  id: '1',
  order: 1,
  description: 'This is a test aim description',
  status: 'Complete',
  articleCount: 0,
};

const longAim: AimType = {
  id: '2',
  order: 2,
  description:
    'This is a very long aim description that exceeds the character limit and should be truncated with a Read More button to allow users to expand and see the full content of the aim.',
  status: 'In Progress',
  articleCount: 3,
};

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

describe('Aim', () => {
  it('renders aim description', () => {
    render(<Aim aim={mockAim} />);
    expect(screen.getByText(mockAim.description)).toBeInTheDocument();
  });

  it('renders aim order badge', () => {
    render(<Aim aim={mockAim} />);
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders aim status pill', () => {
    render(<Aim aim={mockAim} />);
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('truncates long descriptions and shows Read More button', async () => {
    const { container } = render(<Aim aim={longAim} />);

    const descriptionDiv = container.querySelector(
      'div[class*="clampedDescriptionStyles"]',
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
    expect(
      screen.queryByRole('button', { name: /Read Less/i }),
    ).not.toBeInTheDocument();
  });

  it('expands description when Read More is clicked', async () => {
    const { container } = render(<Aim aim={longAim} />);

    const descriptionDiv = container.querySelector(
      'div[class*="clampedDescriptionStyles"]',
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
      expect(screen.getByText(longAim.description)).toBeInTheDocument();
    });
  });

  it('collapses description when Read Less is clicked', async () => {
    const { container } = render(<Aim aim={longAim} />);

    const descriptionDiv = container.querySelector(
      'div[class*="clampedDescriptionStyles"]',
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

    await userEvent.click(screen.getByRole('button', { name: /Read More/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read Less/i }),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /Read Less/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Read More/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Read Less/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('shows articles button when articleCount is greater than 0', () => {
    render(<Aim aim={longAim} />);
    expect(
      screen.getByRole('button', { name: /Articles \(3\)/i }),
    ).toBeInTheDocument();
  });

  it('does not show articles button when articleCount is 0', () => {
    render(<Aim aim={mockAim} />);
    expect(
      screen.queryByRole('button', { name: /Articles/i }),
    ).not.toBeInTheDocument();
  });

  it('toggles articles button on click', async () => {
    render(<Aim aim={longAim} />);

    const articlesButton = screen.getByRole('button', {
      name: /Articles \(3\)/i,
    });
    await userEvent.click(articlesButton);

    // Button should still be present after click
    expect(
      screen.getByRole('button', { name: /Articles \(3\)/i }),
    ).toBeInTheDocument();
  });

  describe('getAimStatusAccent', () => {
    it('returns success for Complete status', () => {
      expect(getAimStatusAccent('Complete')).toBe('success');
    });

    it('returns info for In Progress status', () => {
      expect(getAimStatusAccent('In Progress')).toBe('info');
    });

    it('returns neutral for Pending status', () => {
      expect(getAimStatusAccent('Pending')).toBe('neutral');
    });

    it('returns error for Terminated status', () => {
      expect(getAimStatusAccent('Terminated')).toBe('error');
    });

    it('returns default for unknown status', () => {
      expect(getAimStatusAccent('Unknown' as unknown as AimStatus)).toBe(
        'default',
      );
    });
  });
});
