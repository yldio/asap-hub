import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import OnboardingCoreDetails from '../OnboardingCoreDetails';

const { createUserResponse } = gp2;

it('renders the page description', () => {
  const user = createUserResponse();
  render(<OnboardingCoreDetails {...user} />);
  expect(
    screen.getByText(
      /In order to join the platform, we need to capture some core information/i,
    ),
  ).toBeVisible();
});

it('does not render a back button', () => {
  const user = createUserResponse();
  render(<OnboardingCoreDetails {...user} />);
  expect(
    screen.queryByRole('link', { name: 'Chevron Left Back' }),
  ).not.toBeInTheDocument();
});

it('renders the avatar', () => {
  const user = createUserResponse({ firstName: 'Tony', lastName: 'Stark' });
  render(<OnboardingCoreDetails {...user} />);
  expect(
    screen.getByRole('img', { name: /Profile picture of Tony Stark/i }),
  ).toBeInTheDocument();
});
it('renders the full name', () => {
  const fullDisplayName = 'Anthony E. Stark';
  const user = createUserResponse({ fullDisplayName });
  render(<OnboardingCoreDetails {...user} />);
  expect(
    screen.getByRole('heading', { name: /Anthony E. Stark/i }),
  ).toBeInTheDocument();
});
it('renders the degrees', () => {
  const user = createUserResponse({ degrees: ['BSc', 'MSc'] });
  render(<OnboardingCoreDetails {...user} />);
  expect(
    screen.getByRole('heading', { name: /BSc, MSc/i }),
  ).toBeInTheDocument();
});
it('renders the region', () => {
  const user = createUserResponse({ region: 'Africa' });
  render(<OnboardingCoreDetails {...user} />);
  expect(screen.getByText('Africa', { selector: 'span' })).toBeInTheDocument();
});
it('renders the city, state or province and country', () => {
  const user = createUserResponse({
    city: 'Springfield',
    stateOrProvince: 'Massachusetts',
    country: 'USA',
  });
  render(<OnboardingCoreDetails {...user} />);
  expect(
    screen.getByText('Springfield, Massachusetts, USA'),
  ).toBeInTheDocument();
});
it('renders the positions', () => {
  const user = createUserResponse({
    positions: [
      { role: 'CEO', department: 'Research', institution: 'Stark Enterprises' },
    ],
  });
  render(<OnboardingCoreDetails {...user} />);
  expect(
    screen.getByText('CEO in Research at Stark Enterprises'),
  ).toBeInTheDocument();
});
