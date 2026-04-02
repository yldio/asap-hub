import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArticleItem } from '@asap-hub/model';
import MilestoneArticlesModal from '../MilestoneArticlesModal';

const mockArticles: ArticleItem[] = [
  { id: 'a1', title: 'Alpha-synuclein study', href: '/a1', type: 'Preprint' },
  {
    id: 'a2',
    title: 'LRRK2 research paper',
    href: '/a2',
    type: 'Published',
  },
];

const defaultProps = {
  onClose: jest.fn(),
  onConfirm: jest.fn(),
  loadOptions: jest.fn().mockResolvedValue([]),
};

describe('MilestoneArticlesModal', () => {
  it('renders "Add Related Articles" title when no articles', async () => {
    render(<MilestoneArticlesModal articles={[]} {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Add Related Articles')).toBeInTheDocument();
    });
  });

  it('renders "Edit Related Articles" title when articles exist', async () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} {...defaultProps} />,
    );
    await waitFor(() => {
      expect(screen.getByText('Edit Related Articles')).toBeInTheDocument();
    });
  });

  it('renders description text', async () => {
    render(<MilestoneArticlesModal articles={[]} {...defaultProps} />);
    await waitFor(() => {
      expect(
        screen.getByText(/Only published articles on the CRN Hub/),
      ).toBeInTheDocument();
    });
  });

  it('renders article titles inside the select', async () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} {...defaultProps} />,
    );
    await waitFor(() => {
      expect(screen.getByText('Alpha-synuclein study')).toBeInTheDocument();
      expect(screen.getByText('LRRK2 research paper')).toBeInTheDocument();
    });
  });

  it('renders type badges on article chips', async () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} {...defaultProps} />,
    );
    await waitFor(() => {
      expect(screen.getByText('Preprint')).toBeInTheDocument();
      expect(screen.getByText('Published')).toBeInTheDocument();
    });
  });

  it('removes article when remove button is clicked', async () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} {...defaultProps} />,
    );
    await waitFor(() => {
      expect(
        screen.getByLabelText('Remove Alpha-synuclein study'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByLabelText('Remove Alpha-synuclein study'),
    );
    expect(screen.queryByText('Alpha-synuclein study')).not.toBeInTheDocument();
    expect(screen.getByText('LRRK2 research paper')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = jest.fn();
    render(
      <MilestoneArticlesModal
        articles={[]}
        onClose={onClose}
        onConfirm={jest.fn()}
        loadOptions={defaultProps.loadOptions}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /cancel/i }),
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes modal via the header close button', async () => {
    const onClose = jest.fn();
    render(
      <MilestoneArticlesModal
        articles={[]}
        onClose={onClose}
        onConfirm={jest.fn()}
        loadOptions={defaultProps.loadOptions}
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    const dialog = screen.getByRole('dialog');
    const firstButton = within(dialog).getAllByRole('button')[0]!;
    await userEvent.click(firstButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders Confirm button as enabled', async () => {
    render(<MilestoneArticlesModal articles={[]} {...defaultProps} />);
    await waitFor(() => {
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).not.toBeDisabled();
    });
  });

  it('calls onConfirm with current articles when Confirm is clicked', async () => {
    const onConfirm = jest.fn();
    render(
      <MilestoneArticlesModal
        articles={mockArticles}
        onClose={jest.fn()}
        onConfirm={onConfirm}
        loadOptions={defaultProps.loadOptions}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /confirm/i }),
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'a1', title: 'Alpha-synuclein study' }),
        expect.objectContaining({
          id: 'a2',
          title: 'LRRK2 research paper',
        }),
      ]),
    );
  });

  it('renders select input with placeholder', async () => {
    render(<MilestoneArticlesModal articles={[]} {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Start typing...')).toBeInTheDocument();
    });
  });

  it('does not render remove buttons when no articles', async () => {
    render(<MilestoneArticlesModal articles={[]} {...defaultProps} />);
    await waitFor(() => {
      expect(screen.queryByLabelText(/Remove/)).not.toBeInTheDocument();
    });
  });

  it('handles menu open and close without errors', async () => {
    const loadOptions = jest.fn().mockResolvedValue([]);
    render(
      <MilestoneArticlesModal
        articles={[]}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        loadOptions={loadOptions}
      />,
    );
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'test');
    await waitFor(() => {
      expect(screen.getByText('No articles found')).toBeInTheDocument();
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /confirm/i }),
      ).toBeInTheDocument();
    });
  });

  it('truncates long article titles and shows full title on hover', async () => {
    const longTitle = 'A'.repeat(61);
    const articles: ArticleItem[] = [
      { id: 'long', title: longTitle, href: '/long', type: 'Preprint' },
    ];
    render(<MilestoneArticlesModal articles={articles} {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText(`${'A'.repeat(60)}…`)).toBeInTheDocument();
    });
    const truncatedSpan = screen.getByTitle(longTitle);
    expect(truncatedSpan).toBeInTheDocument();
  });

  it('renders custom option with pill in dropdown', async () => {
    const loadOptions = jest.fn().mockResolvedValue([
      {
        label: 'Some Article',
        value: 'id-1',
        documentType: 'Article',
        type: 'Preprint',
      },
      {
        label: 'Untyped Article',
        value: 'id-2',
        documentType: 'Article',
      },
    ]);
    render(
      <MilestoneArticlesModal
        articles={[
          { id: 'no-type', title: 'Article without type', href: '/no-type' },
        ]}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        loadOptions={loadOptions}
      />,
    );
    expect(screen.getByText('Article without type')).toBeInTheDocument();
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'Some');
    await waitFor(() => {
      expect(screen.getByText('Some Article')).toBeInTheDocument();
    });
    expect(screen.getByText('Untyped Article')).toBeInTheDocument();
    expect(screen.getByText('Preprint')).toBeInTheDocument();
  });

  it('shows no options message when search yields no results', async () => {
    const loadOptions = jest.fn().mockResolvedValue([]);
    render(
      <MilestoneArticlesModal
        articles={[]}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        loadOptions={loadOptions}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText('Start typing...')).toBeInTheDocument();
    });
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'nonexistent');
    await waitFor(() => {
      expect(screen.getByText('No articles found')).toBeInTheDocument();
    });
  });
});
