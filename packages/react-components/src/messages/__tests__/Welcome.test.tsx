import { render, RenderResult } from '@testing-library/react';

import Welcome from '../Welcome';

describe('welcome email template', () => {
  let result!: RenderResult;

  beforeEach(() => {
    result = render(
      <Welcome firstName="John Doe" link="https://example.com" />,
    );
  });

  it('renders the correct grantee name', () => {
    const heading = result.getByRole('heading');
    expect(heading.textContent).toContain('John Doe');
  });

  it('renders the correct link on the Activate Account CTA', () => {
    const cta = result.getByRole('link', { name: /create account/i });
    expect(cta.closest('a')).toHaveAttribute('href', 'https://example.com');
  });

  it('renders the correct mail to on the get in touch mailto link', () => {
    const mailToSupport = result.getByRole('link', {
      name: /our team/i,
    }) as HTMLAnchorElement;

    expect(mailToSupport.protocol).toBe('mailto:');
    expect(mailToSupport.pathname).toBe('techsupport@asap.science');
  });
});
