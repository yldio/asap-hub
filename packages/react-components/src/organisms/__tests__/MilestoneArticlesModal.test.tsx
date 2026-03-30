import { render, screen, within } from '@testing-library/react';
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
};

describe('MilestoneArticlesModal', () => {
  it('renders "Add Related Articles" title when no articles', () => {
    render(<MilestoneArticlesModal articles={[]} {...defaultProps} />);
    expect(screen.getByText('Add Related Articles')).toBeInTheDocument();
  });

  it('renders "Edit Related Articles" title when articles exist', () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} {...defaultProps} />,
    );
    expect(screen.getByText('Edit Related Articles')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<MilestoneArticlesModal articles={[]} {...defaultProps} />);
    expect(
      screen.getByText(/Only published articles on the CRN Hub/),
    ).toBeInTheDocument();
  });

  it('renders article titles inside the select', () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} {...defaultProps} />,
    );
    expect(screen.getByText('Alpha-synuclein study')).toBeInTheDocument();
    expect(screen.getByText('LRRK2 research paper')).toBeInTheDocument();
  });

  it('renders type badges on article chips', () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} {...defaultProps} />,
    );
    expect(screen.getByText('Preprint')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('removes article when remove button is clicked', async () => {
    render(
      <MilestoneArticlesModal articles={mockArticles} {...defaultProps} />,
    );
    const removeButton = screen.getByLabelText('Remove Alpha-synuclein study');
    await userEvent.click(removeButton);
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
      />,
    );
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
      />,
    );
    const dialog = screen.getByRole('dialog');
    const firstButton = within(dialog).getAllByRole('button')[0]!;
    await userEvent.click(firstButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders Confirm button as enabled', () => {
    render(<MilestoneArticlesModal articles={[]} {...defaultProps} />);
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

  it('renders select input with placeholder', () => {
    render(<MilestoneArticlesModal articles={[]} {...defaultProps} />);
    expect(screen.getByText('Start typing...')).toBeInTheDocument();
  });

  it('does not render remove buttons when no articles', () => {
    render(<MilestoneArticlesModal articles={[]} {...defaultProps} />);
    expect(screen.queryByLabelText(/Remove/)).not.toBeInTheDocument();
  });
});
