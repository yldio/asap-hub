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
    const cta = result.getByText(/activate account/i);
    expect(cta.closest('a')).toHaveAttribute('href', 'https://example.com');
  });

  it('renders the correct mail to on the get in touch mailto link', () => {
    const mailToSupport = result.getByRole('link', {
      name: /get in touch/i,
    }) as HTMLAnchorElement;

    expect(mailToSupport.protocol).toBe('mailto:');
    expect(mailToSupport.pathname).toBe('techsupport@asap.science');
  });

  it('renders different variants of the content', () => {
    let cta1;
    let cta2;
    const { queryByRole, rerender } = result;

    cta1 = queryByRole('link', { name: /activate account/i });
    cta2 = queryByRole('link', { name: /create account/i });
    expect(cta1).toHaveTextContent('Activate account');
    expect(cta1).not.toBeNull();
    expect(cta2).toBeNull();

    rerender(
      <Welcome
        firstName="John Doe"
        link="https://example.com"
        variant={'Variant2'}
      />,
    );

    cta1 = queryByRole('link', { name: /activate account/i });
    cta2 = queryByRole('link', { name: /create account/i });
    expect(cta2).toHaveTextContent('Create account');
    expect(cta2).not.toBeNull();
    expect(cta1).toBeNull();
  });
});
