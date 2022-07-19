import { render, screen } from '@testing-library/react';
import NoEvents from '../NoEvents';

it('renders the component', () => {
  const { getByRole } = render(
    <NoEvents displayName="Group" link="/test" type="group" />,
  );
  expect(getByRole('heading').textContent).toContain('doesn’t have any');
  expect(getByRole('link').textContent).toContain('Explore');
});

describe('For groups', () => {
  it('renders for upcoming events', () => {
    render(
      <NoEvents
        displayName="ASAP Group"
        type="group"
        past={false}
        link="/upcomingEvents"
      />,
    );

    expect(
      screen.getByText(/ASAP Group doesn’t have any upcoming events/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/try exploring other upcoming events/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explore & Upcoming Events/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/upcomingEvents');
  });

  it('renders for past events', () => {
    render(
      <NoEvents
        displayName="ASAP Group"
        type="group"
        past={true}
        link="/pastEvents"
      />,
    );

    expect(
      screen.getByText(/ASAP Group doesn’t have any past events/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/try exploring other past events/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explore & Past Events/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/pastEvents');
  });
});

describe('For Teams', () => {
  it('renders for upcoming events', () => {
    render(
      <NoEvents
        displayName="ASAP Team"
        type="team"
        past={false}
        link="/upcomingEvents"
      />,
    );

    expect(
      screen.getByText(/ASAP Team doesn’t have any upcoming events/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/try exploring other upcoming events/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explore & Upcoming Events/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/upcomingEvents');
  });

  it('renders for past events', () => {
    render(
      <NoEvents
        displayName="ASAP Team"
        type="team"
        past={true}
        link="/pastEvents"
      />,
    );

    expect(
      screen.getByText(/ASAP Team doesn’t have any past events/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/try exploring other past events/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explore & Past Events/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/pastEvents');
  });
});
