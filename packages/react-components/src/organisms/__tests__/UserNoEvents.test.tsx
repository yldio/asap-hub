import { render, screen } from '@testing-library/react';
import UserNoEvents from '../UserNoEvents';

it('renders for upcoming events', () => {
  render(<UserNoEvents past={false} link="/upcomingEvents" />);

  expect(
    screen.getByText(/There aren't any upcoming events/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/try exploring other upcoming events/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/Explore Upcoming Events/i)).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/upcomingEvents');
});

it('renders for past events', () => {
  render(<UserNoEvents past={true} link="/pastEvents" />);

  expect(screen.getByText(/There aren't any past events/i)).toBeInTheDocument();
  expect(
    screen.getByText(/try exploring other past events/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/Explore Past Events/i)).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/pastEvents');
});
