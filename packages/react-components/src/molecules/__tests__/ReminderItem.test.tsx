import { render, screen } from '@testing-library/react';
import ReminderItem from '../ReminderItem';

it('renders reminder item with default icon', () => {
  render(<ReminderItem description="description" />);
  expect(screen.getByText('description')).toBeVisible();
  expect(screen.getByTitle('Info')).toBeInTheDocument();
});

it('renders an item with a link', () => {
  const { rerender } = render(
    <ReminderItem entity="Event" description="description" />,
  );
  expect(screen.getByText('description').closest('a')).toBeNull();
  expect(screen.getByTitle('Event')).toBeInTheDocument();

  rerender(
    <ReminderItem
      entity="Event"
      description="description"
      href="http://example.com"
    />,
  );
  expect(screen.getByText('description').closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
  expect(screen.getByTitle('Event')).toBeInTheDocument();
});
