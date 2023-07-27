import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import {
  createEventResponse,
  createInterestGroupResponse,
} from '@asap-hub/fixtures';

import EventConversation from '../EventConversation';

const props: ComponentProps<typeof EventConversation> = {
  ...createEventResponse(),
};

it('renders the card only when group with slack tool is provided', () => {
  const { queryByRole, getByRole, rerender } = render(
    <EventConversation
      {...props}
      interestGroup={{ ...createInterestGroupResponse(), tools: {} }}
    />,
  );
  expect(queryByRole('heading')).toBeNull();
  rerender(
    <EventConversation
      {...props}
      interestGroup={{
        ...createInterestGroupResponse(),
        tools: { slack: 'http://example.com' },
      }}
    />,
  );
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Continue the conversation"`,
  );
});

it('renders slack tool button', () => {
  const { getByTitle } = render(
    <EventConversation
      {...props}
      interestGroup={{
        ...createInterestGroupResponse(),
        tools: { slack: 'http://example.com' },
      }}
    />,
  );
  expect(getByTitle(/slack/i).closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});
it('renders nothing if group is undefined', () => {
  const { queryByText } = render(<EventConversation />);
  expect(queryByText('Continue the conversation')).not.toBeInTheDocument();
});
