import { render, screen } from '@testing-library/react';

import DiscussionAttachedFiles from '../DiscussionAttachedFiles';

const files = [
  {
    id: 'file-1',
    filename: 'report.pdf',
    url: 'https://example.com/report.pdf',
  },
  {
    id: 'file-2',
    filename: 'data.csv',
    url: 'https://example.com/data.csv',
  },
];

it('renders correct text when there is only one or multiple files', () => {
  const { rerender } = render(<DiscussionAttachedFiles files={files} />);
  expect(screen.getByText(/files/i)).toBeInTheDocument();

  rerender(<DiscussionAttachedFiles files={[files[0]!]} />);
  expect(screen.getByText(/file/i)).toBeInTheDocument();
  expect(screen.queryByText(/files/i)).not.toBeInTheDocument();
});

it('renders attached files with links', () => {
  render(<DiscussionAttachedFiles files={files} />);

  expect(screen.getByText('2 attached files')).toBeInTheDocument();
  expect(screen.getByText('report.pdf').closest('a')).toHaveAttribute(
    'href',
    'https://example.com/report.pdf',
  );
  expect(screen.getByText('data.csv').closest('a')).toHaveAttribute(
    'href',
    'https://example.com/data.csv',
  );
});
