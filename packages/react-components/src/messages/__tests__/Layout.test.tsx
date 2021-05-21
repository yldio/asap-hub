import { render } from '@testing-library/react';

import Layout from '../Layout';

it('renders its children', () => {
  const { getByText } = render(
    <Layout appOrigin="https://hub.asap.science">text</Layout>,
  );
  expect(getByText('text')).toBeVisible();
});

it('generates the terms link', () => {
  const { getByText } = render(
    <Layout appOrigin="https://hub.asap.science">text</Layout>,
  );
  expect(getByText(/terms/i).closest('a')!.href).toMatchInlineSnapshot(
    `"https://hub.asap.science/privacy-policy"`,
  );
});
