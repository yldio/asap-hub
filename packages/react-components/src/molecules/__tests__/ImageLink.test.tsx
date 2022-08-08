import { render } from '@testing-library/react';

import ImageLink from '../ImageLink';

it('renders an image with a link', () => {
  const { getByRole } = render(
    <ImageLink imgSrc="http://image.png/" link="https://google.com/" />,
  );

  expect(getByRole('img')).toHaveProperty('src', 'http://image.png/');
  expect(getByRole('link')).toHaveProperty('href', 'https://google.com/');
});

it('renders a placeholder', () => {
  const { queryByRole, getByText } = render(
    <ImageLink placeholder={<div>placeholder</div>} />,
  );

  expect(queryByRole('img')).not.toBeInTheDocument();
  expect(getByText('placeholder')).toBeInTheDocument();
});
