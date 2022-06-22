import { render, screen } from '@testing-library/react';
import GroupNoEvents from '../GroupNoEvents';

it('renders for upcoming events', () => {
  render(<GroupNoEvents past={false} link="/upcomingEvents" />);

  expect(
    screen.getByText(/This group doesn’t have any upcoming events/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/try exploring other upcoming events/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/Explore Upcoming Events/i)).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/upcomingEvents');
});

it('renders for past events', () => {
  render(<GroupNoEvents past={true} link="/pastEvents" />);

  expect(
    screen.getByText(/This group doesn’t have any past events/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/try exploring other past events/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/Explore Past Events/i)).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/pastEvents');
});
