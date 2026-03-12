import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Aim as AimType, AimStatus } from '@asap-hub/model';
import Aim, { getAimStatusAccent } from '../Aim';

const mockFetchArticles = jest.fn(() => Promise.resolve([]));

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

const defaultAimProps = { fetchArticles: mockFetchArticles };

describe('Aim', () => {
  it('renders aim description', () => {
    render(<Aim aim={mockAim} {...defaultAimProps} />);
    expect(screen.getByText(mockAim.description)).toBeInTheDocument();
  });

  it('renders aim order badge', () => {
    render(<Aim aim={mockAim} {...defaultAimProps} />);
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders aim status pill', () => {
    render(<Aim aim={mockAim} {...defaultAimProps} />);
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('shows No articles added and Edit when articleCount is 0', () => {
    render(<Aim aim={mockAim} {...defaultAimProps} />);
    const noArticles = screen.getByText('No articles added');
    expect(noArticles).toBeInTheDocument();
    expect(noArticles).toHaveStyle({ fontStyle: 'italic' });
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.queryByText(/Articles \(\d+\)/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: /Expand articles|Collapse articles/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('shows Articles list and Edit when articleCount is greater than 0', () => {
    const { rerender } = render(<Aim aim={mockAim} {...defaultAimProps} />);
    expect(screen.getByText('No articles added')).toBeInTheDocument();

    rerender(<Aim aim={longAim} {...defaultAimProps} />);
    expect(screen.getByText('Articles (3)')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Expand articles' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('toggles articles section on click', async () => {
    render(<Aim aim={longAim} {...defaultAimProps} />);

    const articlesButton = screen.getByRole('button', {
      name: 'Expand articles',
    });
    await userEvent.click(articlesButton);

    expect(
      screen.getByRole('button', { name: 'Collapse articles' }),
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
