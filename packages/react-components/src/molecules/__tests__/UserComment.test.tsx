import { Message } from '@asap-hub/model';
import { render } from '@testing-library/react';

import UserComment from '../UserComment';

const baseMessage: Message = {
  text: '',
  createdDate: '2024-01-01T00:00:00Z',
  createdBy: {
    id: 'user-1',
    firstName: 'Jane',
    lastName: 'Doe',
    displayName: 'Jane Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    teams: [{ id: 'team-1', name: 'Team 1' }],
  },
};

describe('UserComment', () => {
  it('renders a clickable anchor for markdown links in discussion text', () => {
    const { container } = render(
      <UserComment
        {...baseMessage}
        text="See [our docs](https://example.com/docs) for details"
      />,
    );

    const anchor = container.querySelector(
      'a[href="https://example.com/docs"]',
    );
    expect(anchor).not.toBeNull();
    expect(anchor).toHaveTextContent('our docs');
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders multiple links in the same message', () => {
    const { container } = render(
      <UserComment
        {...baseMessage}
        text="See [A](https://a.example.com) and [B](https://b.example.com)"
      />,
    );

    expect(
      container.querySelector('a[href="https://a.example.com"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('a[href="https://b.example.com"]'),
    ).not.toBeNull();
  });

  it('renders plain text without anchors when the message has no links', () => {
    const { container, getByText } = render(
      <UserComment {...baseMessage} text="Just plain text, no links here" />,
    );

    expect(getByText('Just plain text, no links here')).toBeInTheDocument();
    expect(container.querySelector('a.editor-link')).toBeNull();
  });
});
