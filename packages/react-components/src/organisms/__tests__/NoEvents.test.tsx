import { render, screen } from '@testing-library/react';
import NoEvents from '../NoEvents';

it('renders the component', () => {
  const { getByRole } = render(<NoEvents link="/test" type="interest group" />);
  expect(getByRole('heading').textContent).toContain('doesn’t have any');
  expect(getByRole('link').textContent).toContain('Explore');
});
describe('upcoming and past', () => {
  it('renders for upcoming events', () => {
    render(<NoEvents type="team" past={false} link="/upcomingEvents" />);

    expect(
      screen.getByText(/try exploring other upcoming events/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explore Upcoming Events/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/upcomingEvents');
  });

  it('renders for past events', () => {
    render(<NoEvents type="team" past={true} link="/pastEvents" />);

    expect(
      screen.getByText(/try exploring other past events/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explore Past Events/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/pastEvents');
  });
});

describe('type', () => {
  it('renders for teams', () => {
    render(<NoEvents type="team" past={true} link="/pastEvents" />);

    expect(screen.getByText(/This team doesn’t/i)).toBeInTheDocument();
  });

  it('renders for working group', () => {
    render(<NoEvents type="working group" past={true} link="/pastEvents" />);

    expect(screen.getByText(/This working group doesn’t/i)).toBeInTheDocument();
  });

  it('renders for interest group', () => {
    render(<NoEvents type="interest group" past={true} link="/pastEvents" />);

    expect(
      screen.getByText(/This interest group doesn’t/i),
    ).toBeInTheDocument();
  });
});
