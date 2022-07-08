import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Auth Frontend App', () => {
  let currentLocation: Location;

  beforeAll(() => {
    currentLocation = window.location;
    delete (window as Partial<Window>).location;
    window.location = new URL(
      'https://www.example.com?redirect_uri=https://gp2.asap.science',
    ) as unknown as Location;
    window.location.replace = jest.fn();
  });

  afterAll(() => {
    window.location = currentLocation;
  });

  test('Should render the login page', async () => {
    render(<App />);

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Sign in to the GP2 Hub/i }),
    ).toBeInTheDocument();
  });
});
