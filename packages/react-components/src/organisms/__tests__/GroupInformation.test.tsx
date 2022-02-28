import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import GroupInformation from '../GroupInformation';

const props: ComponentProps<typeof GroupInformation> = {
  description: '',
  tags: [],
};

it('displays the description', () => {
  const { getByText } = render(
    <GroupInformation {...props} description={'The best group'} />,
  );
  expect(getByText('The best group')).toBeVisible();
});

it('does not show ellipses or show more button on short descriptions', () => {
  const { queryByText } = render(
    <GroupInformation {...props} description={'The best group'} />,
  );
  expect(queryByText(/…/)).toBeNull();
  expect(queryByText(/more/i)).toBeNull();
});

it('does not shows ellipses and show more button on long descriptions', () => {
  const { queryByText } = render(
    <GroupInformation {...props} description={'The best group '.repeat(100)} />,
  );

  expect(queryByText(/…/)).toBeNull();
  expect(queryByText(/show more/i)).toBeNull();
});

it('displays tags', () => {
  const { getByText } = render(
    <GroupInformation {...props} tags={['ABC', 'def']} />,
  );
  expect(getByText('ABC')).toBeVisible();
  expect(getByText('def')).toBeVisible();
});
