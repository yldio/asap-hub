import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createGroupResponse } from '@asap-hub/fixtures';

import EventConversation from '../EventConversation';

const props: ComponentProps<typeof EventConversation> = {
  ...createGroupResponse(),
};

it('renders when group with slack tool is provided', () => {
  const { queryByRole, getByRole, rerender } = render(
    <EventConversation {...props} tools={{}} />,
  );
  expect(queryByRole('heading')).toBeNull();
  rerender(
    <EventConversation {...props} tools={{ slack: 'http://example.com' }} />,
  );
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Continue the conversation"`,
  );
});

it('renders slack tool button', () => {
  const { getByTitle } = render(
    <EventConversation {...props} tools={{ slack: 'http://example.com' }} />,
  );
  expect(getByTitle(/slack/i).closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});
