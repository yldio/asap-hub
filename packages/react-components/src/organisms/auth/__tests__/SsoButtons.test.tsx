import { render } from '@testing-library/react';

import SsoButtons from '../SsoButtons';

it.each(['Google', 'ORCID'])('renders a %s signin button', (provider) => {
  const { getByText } = render(<SsoButtons />);
  expect(getByText(new RegExp(`with ${provider}`, 'i'))).toBeVisible();
});
