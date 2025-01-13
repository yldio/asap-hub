import {
  createDiscussionReplies,
  createDiscussionResponse,
  createMessage,
} from '@asap-hub/fixtures';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { act } from 'react-dom/test-utils';
import Discussion from '../Discussion';

const props: ComponentProps<typeof Discussion> = {
  id: 'discussion-id',
  modalTitle: 'Reply to quick check',
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

  expect(getByText(/Reply to quick check/i)).toBeVisible();
  userEvent.click(getByRole('button', { name: /Cancel/i }));

  expect(queryByText(/Reply to quick check/i)).not.toBeInTheDocument();
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

  it('shows end of discussion button when canEndDiscussion is true and discussion not ended', async () => {
    const replies = createDiscussionReplies(6);
    const discussion = createDiscussionResponse(message, replies);
    getDiscussion.mockReturnValue(discussion);

    const { queryByTestId } = render(
      <Discussion {...propsWithReplies} canEndDiscussion />,
    );
    await waitFor(() => {
      expect(queryByTestId('end-discussion-button')).toBeInTheDocument();
    });
  });

  it('doesnt show end of discussion button when canEndDiscussion is false', async () => {
    const replies = createDiscussionReplies(6);
    const discussion = createDiscussionResponse(message, replies);
    getDiscussion.mockReturnValue(discussion);

    const { queryByTestId } = render(
      <Discussion {...propsWithReplies} canEndDiscussion={false} />,
    );

    await waitFor(() => {
      expect(queryByTestId('end-discussion-button')).not.toBeInTheDocument();
    });
  });
  it('doesnt show end of discussion button when discussion has ended', async () => {
    const replies = createDiscussionReplies(6);
    const discussion = createDiscussionResponse(message, replies);
    getDiscussion.mockReturnValue({
      ...discussion,
      endedAt: '2025-01-01T10:00:00.000Z',
    });

    const { queryByTestId } = render(
      <Discussion {...propsWithReplies} canEndDiscussion />,
    );

    await waitFor(() => {
      expect(queryByTestId('end-discussion-button')).not.toBeInTheDocument();
    });
  });

  it('shows end of discussion modal and calls onEndDiscussion method', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    const replies = createDiscussionReplies(6);
    const discussion = createDiscussionResponse(message, replies);
    getDiscussion.mockReturnValue(discussion);
    const onEndDiscussion = jest.fn();
    const { getByTestId, queryByText } = render(
      <Discussion
        {...propsWithReplies}
        canEndDiscussion
        onEndDiscussion={onEndDiscussion}
      />,
    );
    act(() => {
      userEvent.click(getByTestId('end-discussion-button'));
    });

    await waitFor(() => {
      expect(queryByText(/End discussion and notify\?/i)).toBeInTheDocument();
    });

    act(() => {
      userEvent.click(getByTestId('submit-end-discussion'));
    });

    await waitFor(() => {
      expect(onEndDiscussion).toHaveBeenCalled();
      expect(
        queryByText(/End discussion and notify\?/i),
      ).not.toBeInTheDocument();
    });

    // re-opens end discussion modal to test cancel button
    act(() => {
      userEvent.click(getByTestId('end-discussion-button'));
    });

    await waitFor(() => {
      expect(queryByText(/End discussion and notify\?/i)).toBeInTheDocument();
    });

    act(() => {
      userEvent.click(getByTestId('cancel-end-discussion-button'));
    });
  });

  it('doesnt show end of discussion modal when onEndDiscussion is not defined', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    const replies = createDiscussionReplies(6);
    const discussion = createDiscussionResponse(message, replies);
    getDiscussion.mockReturnValue(discussion);

    const { getByTestId, queryByText } = render(
      <Discussion {...propsWithReplies} canEndDiscussion />,
    );

    act(() => {
      userEvent.click(getByTestId('end-discussion-button'));
    });

    await waitFor(() => {
      expect(
        queryByText(/End discussion and notify\?/i),
      ).not.toBeInTheDocument();
    });
  });
});
