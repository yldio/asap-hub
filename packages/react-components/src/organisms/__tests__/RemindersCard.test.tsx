import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  createListReminderResponse,
  createReminderResponse,
} from '@asap-hub/fixtures';

import RemindersCard from '../RemindersCard';

const props: ComponentProps<typeof RemindersCard> = {
  canPublish: false,
  reminders: [],
};
it('renders reminders component with no reminders', () => {
  render(<RemindersCard {...props} />);
  expect(screen.getByTitle('Info')).toBeInTheDocument();
  expect(screen.getByText(/Do you have anything to share/i)).toBeVisible();
});

it('renders reminders component for users that can publish with no reminders', () => {
  render(<RemindersCard {...props} canPublish />);
  expect(screen.getByTitle('Info')).toBeInTheDocument();
  expect(screen.getByText(/There are no reminders./i)).toBeVisible();
});

it('renders reminder a reminder without a link', () => {
  render(
    <RemindersCard
      {...props}
      reminders={[
        {
          ...createReminderResponse({}),
          href: undefined,
          entity: 'Event',
          description: 'example description',
        },
      ]}
    />,
  );
  expect(screen.getByText('example description').closest('a')).toBeNull();
  expect(screen.getByTitle('Event')).toBeInTheDocument();
});

it('renders reminders with a link', () => {
  render(
    <RemindersCard
      {...props}
      reminders={[
        {
          ...createReminderResponse({}),
          description: 'example description',
          href: 'http://example.com',
        },
      ]}
    />,
  );
  expect(screen.getByText('example description').closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});

describe('show more and show less functionality', () => {
  const propsWith10Reminders: ComponentProps<typeof RemindersCard> = {
    ...props,
    reminders: createListReminderResponse(10).items.map((reminder, index) => ({
      ...reminder,
      description: `reminder-${index}`,
    })),
  };
  it('limits reminders shown when a limit is specified', () => {
    const { rerender } = render(
      <RemindersCard {...propsWith10Reminders} limit={undefined} />,
    );
    expect(screen.getAllByText(/reminder-/).length).toEqual(10);

    rerender(<RemindersCard {...propsWith10Reminders} limit={3} />);
    expect(screen.getAllByText(/reminder-/).length).toEqual(3);
  });

  it('shows the show more button when reminders exceeds limit', () => {
    const { rerender } = render(
      <RemindersCard {...propsWith10Reminders} limit={10} />,
    );
    expect(screen.queryByText(/show/i)).toBeNull();
    expect(screen.getAllByText(/reminder-/).length).toEqual(10);

    rerender(<RemindersCard {...propsWith10Reminders} limit={5} />);
    expect(screen.getAllByText(/reminder-/).length).toEqual(5);
    expect(screen.queryByText(/show/i)).toBeVisible();
  });

  it('shows all reminders on show more and returns to limited list on show less', () => {
    render(<RemindersCard {...propsWith10Reminders} limit={5} />);
    expect(screen.getAllByText(/reminder-/).length).toEqual(5);

    userEvent.click(screen.getByText(/show more/i));

    expect(screen.getAllByText(/reminder-/).length).toEqual(10);

    userEvent.click(screen.getByText(/show less/i));
    expect(screen.getAllByText(/reminder-/).length).toEqual(5);
  });
});
