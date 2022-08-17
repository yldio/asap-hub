import { render } from '@testing-library/react';

import ImageLink from '../ImageLink';

it('renders an image with a link', () => {
  const { getByRole } = render(
    <ImageLink link="https://google.com/">
      <img src="http://image.png/" alt="alt" />
    </ImageLink>,
  );

  expect(getByRole('img')).toHaveProperty('src', 'http://image.png/');
  expect(getByRole('link')).toHaveProperty('href', 'https://google.com/');
});

it('renders a placeholder', () => {
  const { queryByRole, getByText } = render(
    <ImageLink link="https://google.com/">
      <div>placeholder</div>
    </ImageLink>,
  );

  expect(queryByRole('img')).not.toBeInTheDocument();
  expect(getByText('placeholder')).toBeInTheDocument();
});
