import React from 'react';
import { render } from '@testing-library/react';

import Welcome from '../Welcome';

it('renders the welcome template with name and link', () => {
  const { getByRole } = render(
    <Welcome
      firstName="John Doe"
      link="https://example.com"
      privacyPolicyHref={'https://hub.asap.science/privacy-policy'}
      termsHref={'https://hub.asap.science/terms-and-conditions'}
    />,
  );

  const heading = getByRole('heading');
  const cta = getByRole('link', {
    name: /activate account/i,
  }) as HTMLAnchorElement;
  const mailToSupport = getByRole('link', {
    name: /get in touch/i,
  }) as HTMLAnchorElement;

  expect(heading.textContent).toContain('John Doe');
  expect(cta.href).toBe('https://example.com/');
  expect(mailToSupport.protocol).toBe('mailto:');
  expect(mailToSupport.pathname).toBe('techsupport@asap.science');
});
