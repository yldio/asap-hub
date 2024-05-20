import { render, screen } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom/server';
import OnboardedTabLink from '../OnboardedTabLink';

describe('OnboardedTabLink', () => {
  it('should display the link when enabled', () => {
    render(
      <OnboardedTabLink index={1} href={'/test'}>
        Link Test
      </OnboardedTabLink>,
      {
        wrapper: StaticRouter,
      },
    );
    const link = screen.getByRole('link', { name: /link test/i });
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should not display the link when disabled', () => {
    render(
      <OnboardedTabLink index={1} disabled href={'/test'}>
        Link Test
      </OnboardedTabLink>,
      { wrapper: StaticRouter },
    );
    expect(
      screen.queryByRole('link', { name: /link test/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Link Test')).toBeVisible();
  });
});
