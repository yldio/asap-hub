import { render } from '@testing-library/react';

import AgreeToTerms from '../AgreeToTerms';

it('generates the terms link', () => {
  const { getByText } = render(
    <AgreeToTerms appOrigin="https://hub.asap.science" />,
  );
  expect(getByText(/terms/i).closest('a')!.href).toMatchInlineSnapshot(
    `"https://hub.asap.science/terms-and-conditions"`,
  );
});
