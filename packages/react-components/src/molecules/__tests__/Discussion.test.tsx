import {
  createDiscussionReplies,
  createDiscussionResponse,
  createMessage,
} from '@asap-hub/fixtures';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import Discussion from '../Discussion';

const props: ComponentProps<typeof Discussion> = {
  id: 'discussion-id',
  canReply: true,
  getDiscussion: jest.fn().mockReturnValue(createDiscussionResponse()),
  onSave: jest.fn(),
};

it('handles case when discussion is not found', () => {
  const getDiscussion = jest
    .fn()
    .mockReturnValueOnce(createDiscussionResponse());
  const { getByText, queryByText, rerender } = render(
    <Discussion {...props} getDiscussion={getDiscussion} />,
  );

  expect(getByText('Reply')).toBeVisible();

  rerender(<Discussion {...props} getDiscussion={getDiscussion} />);

  expect(queryByText(/Reply/i)).not.toBeInTheDocument();
});

it('should not show reply button when canReply is false', async () => {
  const getDiscussion = jest
    .fn()
    .mockReturnValueOnce(createDiscussionResponse());
  const { queryByText } = render(
    <Discussion {...props} canReply={false} getDiscussion={getDiscussion} />,
  );
  await waitFor(() => {
    expect(queryByText(/Reply/i)).not.toBeInTheDocument();
  });
});

it('displays discussion message', async () => {
  const message = 'test message';
  const discussion = createDiscussionResponse(message);
  const getDiscussion = jest.fn().mockReturnValueOnce(discussion);
  const { getByText } = render(
    <Discussion {...props} getDiscussion={getDiscussion} />,
  );
  await waitFor(() => {
    expect(getByText(message)).toBeVisible();
  });
});

it('displays reply modal when user clicks reply button', async () => {
  const { queryByRole, getByRole } = render(<Discussion {...props} />);

  await waitFor(() => {
    expect(queryByRole('button', { name: /Send/i })).not.toBeInTheDocument();
  });

  userEvent.click(getByRole('button', { name: /Reply Icon/i }));

  await waitFor(() => {
    expect(getByRole('button', { name: /Send/i })).toBeVisible();
  });
});

it('removes reply modal when user clicks cancel button', () => {
  const { getByText, getByRole, queryByText } = render(
    <Discussion {...props} />,
  );

  userEvent.click(getByRole('button', { name: /Reply Icon/i }));

  expect(getByText(/Reply/i, { selector: 'h3' })).toBeVisible();
  userEvent.click(getByRole('button', { name: /Cancel/i }));

  expect(queryByText(/Reply/i, { selector: 'h3' })).not.toBeInTheDocument();
});

describe('when there are replies', () => {
  const getDiscussion = jest.fn();
  const propsWithReplies = {
    ...props,
    getDiscussion,
  };
  const message = 'test message';

  beforeEach(() => {
    const replies = [createMessage('test reply')];
    const discussion = createDiscussionResponse(message, replies);
    getDiscussion.mockReturnValue(discussion);
  });

  it('displays replies when expanded', async () => {
    const { getByText, getByTestId, queryByText } = render(
      <Discussion {...propsWithReplies} />,
    );
    await waitFor(() => {
      expect(queryByText(/test reply/i)).not.toBeInTheDocument();
    });

    userEvent.click(getByTestId('discussion-collapsible-button'));

    await waitFor(() => {
      expect(getByText(/test reply/i)).toBeVisible();
    });
  });

  it('displays number of replies', async () => {
    const { getByText } = render(<Discussion {...propsWithReplies} />);
    await waitFor(() => {
      expect(getByText(/1 reply/i)).toBeVisible();
    });
  });

  it('displays count of extra replies when there are more than 5 replies', async () => {
    const replies = createDiscussionReplies(6);
    const discussion = createDiscussionResponse(message, replies);
    getDiscussion.mockReturnValue(discussion);
    const { getByLabelText, getByText } = render(
      <Discussion {...propsWithReplies} />,
    );
    await waitFor(() => {
      expect(getByText(/6 replies/i)).toBeVisible();

      expect(getByLabelText(/\+1/)).toBeVisible();
    });
  });

  it('clicking on number of replies expands replies list', async () => {
    const { getByText, queryByText } = render(
      <Discussion {...propsWithReplies} />,
    );
    await waitFor(() => {
      expect(queryByText(/test reply/i)).not.toBeInTheDocument();
    });

    userEvent.click(getByText(/1 reply/i));

    await waitFor(() => {
      expect(getByText(/test reply/i)).toBeVisible();
    });
  });

  it('clicking on count of extra replies expands replies list', async () => {
    const replies = createDiscussionReplies(6);
    const discussion = createDiscussionResponse(message, replies);
    getDiscussion.mockReturnValue(discussion);

    const { getByLabelText, getByText, queryByText } = render(
      <Discussion {...propsWithReplies} />,
    );
    await waitFor(() => {
      expect(queryByText(/test reply 1/i)).not.toBeInTheDocument();
    });
    userEvent.click(getByLabelText(/\+1/));

    await waitFor(() => {
      expect(getByText(/test reply 1/i)).toBeVisible();
    });
  });
});
