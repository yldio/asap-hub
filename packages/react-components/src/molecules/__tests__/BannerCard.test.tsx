import { render } from '@testing-library/react';

import BannerCard from '../BannerCard';

it('renders the children', () => {
  const { container } = render(<BannerCard type="success">Text</BannerCard>);
  expect(container).toHaveTextContent('Text');
});

it.each`
  type         | icon
  ${'success'} | ${/tick/i}
  ${'warning'} | ${/warning/i}
`('renders an icon matching the type', ({ type, icon }) => {
  const { getByTitle } = render(<BannerCard type={type}>Text</BannerCard>);
  expect(getByTitle(icon)).toBeInTheDocument();
});
