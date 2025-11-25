import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Auth Frontend App', () => {
  let currentLocation: Location;

  beforeAll(() => {
    currentLocation = window.location;
    delete (window as Partial<Window>).location;
    // Create URL with query params and hash - both are needed
    const testUrl = new URL(
      'https://www.example.com?redirect_uri=https://hub.asap.science#/login',
    );
    // Ensure all properties HashRouter needs are accessible
    window.location = {
      ...testUrl,
      origin: testUrl.origin,
      href: testUrl.href,
      search: testUrl.search,
      hash: '#/login',
      replace: jest.fn(),
    } as unknown as Location;
  });

  afterAll(() => {
    window.location = currentLocation;
  });

  test('Should render the login page', async () => {
    render(<App />);

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    // HashRouter's Navigate component runs asynchronously in React Router 6
    // Use findByRole to wait for navigation to complete
    expect(
      await screen.findByRole('heading', { name: /Sign in to the ASAP Hub/i }),
    ).toBeInTheDocument();
  });
});
