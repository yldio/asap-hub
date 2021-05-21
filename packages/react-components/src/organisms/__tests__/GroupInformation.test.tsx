import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

it('shows the ellipses and show more button on long descriptions', () => {
  const { queryByText } = render(
    <GroupInformation {...props} description={'The best group '.repeat(100)} />,
  );

  expect(queryByText(/…/)).toBeVisible();
  expect(queryByText(/show more/i)).toBeVisible();
});

it('toggles the description text length', () => {
  const { getByText, queryByText } = render(
    <GroupInformation {...props} description={'The best group '.repeat(100)} />,
  );
  const shortText = getByText(/the best group/i).textContent ?? '';

  userEvent.click(getByText(/show more/i));
  expect(queryByText(/…/)).toBeNull();
  expect(queryByText(/show less/i)).toBeVisible();
  const longText = getByText(/the best group/i).textContent ?? '';
  expect(shortText.length).toBeLessThan(longText.length);

  userEvent.click(getByText(/show less/i));
  expect(queryByText(/…/)).toBeVisible();
  expect(queryByText(/show more/i)).toBeVisible();

  expect((getByText(/the best group/i).textContent ?? '').length).toEqual(
    shortText.length,
  );
});

it('displays tags', () => {
  const { getByText } = render(
    <GroupInformation {...props} tags={['ABC', 'def']} />,
  );
  expect(getByText('ABC')).toBeVisible();
  expect(getByText('def')).toBeVisible();
});
