import React from 'react';
import { render } from '@testing-library/react';

import Welcome from '../Welcome';

it('renders the welcome template with name and link', () => {
  const { getByRole } = render(
    <Welcome
      firstName="John"
      lastName="Doe"
      link="https://example.com"
      privacyPolicyHref={'https://hub.asap.science/privacy-policy'}
      termsHref={'https://hub.asap.science/terms-and-conditions'}
    />,
  );

  const heading = getByRole('heading');
  expect(heading.textContent).toContain('John Doe');
});
