import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import TeamCreateOutputFormSharingCard from '../TeamCreateOutputFormSharingCard';

const props: ComponentProps<typeof TeamCreateOutputFormSharingCard> = {
  description: '',
  isSaving: false,
  title: '',
  link: '',
  onChangeDescription: jest.fn(),
  onChangeLink: jest.fn(),
  onChangeTitle: jest.fn(),
};
it('renders the card with provided values', () => {
  const { getByDisplayValue } = render(
    <TeamCreateOutputFormSharingCard
      {...props}
      description="description"
      link="http://example.com"
      title="title"
    />,
  );
  expect(getByDisplayValue('description')).toBeVisible();
  expect(getByDisplayValue('http://example.com')).toBeVisible();
  expect(getByDisplayValue('title')).toBeVisible();
});

it.each`
  title            | label             | error
  ${'Description'} | ${/description/i} | ${'Please enter a description'}
  ${'Url'}         | ${/URL/i}         | ${'Please enter a valid URL, starting with http://'}
  ${'Title'}       | ${/title/i}       | ${'Please enter a title'}
`('shows error message for missing value $title', async ({ label, error }) => {
  const { getByLabelText, findByText } = render(
    <TeamCreateOutputFormSharingCard {...props} />,
  );
  const input = getByLabelText(label);
  fireEvent.focusOut(input);
  expect(await findByText(error)).toBeVisible();
});

it.each`
  field            | label             | prop
  ${'Description'} | ${/description/i} | ${'onChangeDescription'}
  ${'Url'}         | ${/URL/i}         | ${'onChangeLink'}
  ${'Title'}       | ${/title/i}       | ${'onChangeTitle'}
`('triggers an onchange event for $field', async ({ label, prop }) => {
  const onChangeFn = jest.fn();
  const { getByLabelText } = render(
    <TeamCreateOutputFormSharingCard {...{ ...props, [prop]: onChangeFn }} />,
  );
  const input = getByLabelText(label);
  fireEvent.change(input, { target: { value: 'test' } });
  expect(onChangeFn).toHaveBeenLastCalledWith('test');
});
