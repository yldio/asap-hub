import { createDiscussionResponse, createMessage } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import Discussion from '../Discussion';

const props: ComponentProps<typeof Discussion> = {
  id: 'discussion-id',
  getDiscussion: jest.fn().mockReturnValue(createDiscussionResponse()),
  onReplyToDiscussion: jest.fn(),
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

it('displays discussion details', () => {
  const message = 'test message';
  const replies = [createMessage('test reply')];
  const discussion = createDiscussionResponse(message, replies);
  const getDiscussion = jest.fn().mockReturnValueOnce(discussion);
  const { getByText } = render(
    <Discussion {...props} getDiscussion={getDiscussion} />,
  );

  expect(getByText(message)).toBeVisible();
  expect(getByText(replies[0]!.text)).toBeVisible();
});

it('displays reply modal when user clicks reply button', () => {
  const { queryByRole, getByRole } = render(<Discussion {...props} />);

  expect(queryByRole('button', { name: /Send/i })).not.toBeInTheDocument();

  userEvent.click(getByRole('button', { name: /Reply Icon/i }));

  expect(getByRole('button', { name: /Send/i })).toBeVisible();
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
