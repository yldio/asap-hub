import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArticleItem } from '@asap-hub/model';
import MilestoneArticlesModal from '../MilestoneArticlesModal';

const mockArticles: ArticleItem[] = [
  { id: 'a1', title: 'Alpha-synuclein study', href: '/a1', type: 'Preprint' },
  { id: 'a2', title: 'LRRK2 research paper', href: '/a2', type: 'Published' },
];

describe('MilestoneArticlesModal', () => {
  it('renders "Add Related Articles" title when no articles', () => {
    render(<MilestoneArticlesModal articles={[]} onClose={jest.fn()} />);
    expect(screen.getByText('Add Related Articles')).toBeInTheDocument();
  });

  it('renders "Edit Related Articles" title when articles exist', () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} onClose={jest.fn()} />,
    );
    expect(screen.getByText('Edit Related Articles')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<MilestoneArticlesModal articles={[]} onClose={jest.fn()} />);
    expect(
      screen.getByText(/Only published articles on the CRN Hub/),
    ).toBeInTheDocument();
  });

  it('renders article chips with titles', () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} onClose={jest.fn()} />,
    );
    expect(screen.getByText('Alpha-synuclein study')).toBeInTheDocument();
    expect(screen.getByText('LRRK2 research paper')).toBeInTheDocument();
  });

  it('renders type badges on article chips', () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} onClose={jest.fn()} />,
    );
    expect(screen.getByText('Preprint')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('removes article chip when X is clicked', async () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} onClose={jest.fn()} />,
    );
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    await userEvent.click(removeButtons[0]!);
    expect(screen.queryByText('Alpha-synuclein study')).not.toBeInTheDocument();
    expect(screen.getByText('LRRK2 research paper')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = jest.fn();
    render(<MilestoneArticlesModal articles={[]} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes modal via the header close button', async () => {
    const onClose = jest.fn();
    render(<MilestoneArticlesModal articles={[]} onClose={onClose} />);
    // The close X button is in the header, rendered before Cancel/Confirm.
    // Since the crossIcon SVG has no accessible text, we find it by position:
    // it is the first button in the dialog.
    const dialog = screen.getByRole('dialog');
    const firstButton = dialog.querySelector('button');
    expect(firstButton).toBeTruthy();
    await userEvent.click(firstButton!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders Confirm button as disabled when no onConfirm provided', () => {
    render(<MilestoneArticlesModal articles={[]} onClose={jest.fn()} />);
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toBeDisabled();
  });

  it('renders Confirm button as enabled when onConfirm is provided', () => {
    render(
      <MilestoneArticlesModal
        articles={[]}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).not.toBeDisabled();
  });

  it('calls onConfirm with current articles when Confirm is clicked', async () => {
    const onConfirm = jest.fn();
    render(
      <MilestoneArticlesModal
        articles={mockArticles}
        onClose={jest.fn()}
        onConfirm={onConfirm}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith(mockArticles);
  });

  it('renders disabled search input', () => {
    render(<MilestoneArticlesModal articles={[]} onClose={jest.fn()} />);
    const searchInput = screen.getByRole('textbox', {
      name: /search articles/i,
    });
    expect(searchInput).toBeDisabled();
  });

  it('does not render article chips when no articles', () => {
    render(<MilestoneArticlesModal articles={[]} onClose={jest.fn()} />);
    expect(screen.queryByRole('button', { name: /remove/i })).toBeNull();
  });
});
