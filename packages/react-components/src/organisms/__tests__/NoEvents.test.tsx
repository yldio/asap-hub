import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
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
  it.each(['interest group', 'team', 'working group', 'member'])(
    'renders for type',
    (type) => {
      render(
        <NoEvents
          type={type as ComponentProps<typeof NoEvents>['type']}
          past={true}
          link="/pastEvents"
        />,
      );
      expect(
        screen.getByText(new RegExp(`This ${type} doesn’t`)),
      ).toBeInTheDocument();
    },
  );
});
