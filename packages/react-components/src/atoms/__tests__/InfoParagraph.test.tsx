import { render } from '@testing-library/react';

import InfoParagraph from '../InfoParagraph';

it('renders the info paragraph', () => {
  const screen = render(
    <InfoParagraph
      boldText="this is the bold part"
      bodyText="this is the body part"
    />,
  );
  expect(screen.getByText('this is the bold part')).toBeVisible();
  expect(screen.getByText('this is the bold part')).toHaveStyle(
    'font-weight: bold',
  );
  expect(screen.getByText('this is the body part')).toBeVisible();
});
