import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import OnboardingPageFooter from '../OnboardingPageFooter';

describe('OnboardingPageFooter', () => {
  const defaultProps = {
    previousHref: '',
    continueHref: '',
    isContinueEnabled: false,
    publishUser: jest.fn(),
  };
  it('renders the links with the right props', () => {
    render(
      <OnboardingPageFooter
        {...defaultProps}
        previousHref="/previous"
        continueHref="/next"
        isContinueEnabled
      />,
      {
        wrapper: MemoryRouter,
      },
    );
    const links = screen.getAllByRole('link') as HTMLAnchorElement[];
    expect(links.map(({ textContent }) => textContent)).toMatchObject([
      expect.stringMatching('Sign Out'),
      expect.stringMatching('Previous'),
      expect.stringMatching('Continue'),
    ]);
    expect(links.map(({ href }) => href)).toMatchObject([
      expect.stringMatching('/logout'),
      expect.stringMatching('/previous'),
      expect.stringMatching('/next'),
    ]);
  });
  it('renders publish button if theres on continueHref', () => {
    render(
      <OnboardingPageFooter
        {...defaultProps}
        continueHref={undefined}
        isContinueEnabled
      />,
      {
        wrapper: MemoryRouter,
      },
    );
    expect(
      screen.queryByRole('link', { name: 'Continue' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeVisible();
  });
  it('calls the publishUser function when pressing the publish button', async () => {
    const publishUser = jest.fn();
    render(
      <OnboardingPageFooter
        {...defaultProps}
        continueHref={undefined}
        isContinueEnabled
        publishUser={publishUser}
      />,
      {
        wrapper: MemoryRouter,
      },
    );
    userEvent.click(screen.getByRole('button', { name: 'Publish' }));
    expect(publishUser).toHaveBeenCalled();
  });
});
