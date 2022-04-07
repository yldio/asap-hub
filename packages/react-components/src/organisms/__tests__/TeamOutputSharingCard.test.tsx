import { fireEvent } from '@testing-library/dom';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { startOfTomorrow } from 'date-fns';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';
import TeamCreateOutputFormSharingCard from '../TeamCreateOutputFormSharingCard';

const props: ComponentProps<typeof TeamCreateOutputFormSharingCard> = {
  description: '',
  isSaving: false,
  title: '',
  link: '',
  subTypes: [],
  type: 'Article',
  asapFunded: 'Not Sure',
  usedInPublication: 'Not Sure',
  sharingStatus: 'Network Only',
};
it('renders the card with provided values', () => {
  const { getByDisplayValue } = render(
    <TeamCreateOutputFormSharingCard
      {...props}
      type="Article"
      description="description"
      link="http://example.com"
      title="title"
      subTypes={['Preprint']}
    />,
  );
  expect(getByDisplayValue('description')).toBeVisible();
  expect(getByDisplayValue('http://example.com')).toBeVisible();
  expect(getByDisplayValue('title')).toBeVisible();
  expect(getByDisplayValue('Preprint')).toBeVisible();
});

it.each`
  title            | label             | error
  ${'Description'} | ${/description/i} | ${'Please enter a description'}
  ${'Url'}         | ${/URL/i}         | ${'Please enter a valid URL, starting with http://'}
  ${'Title'}       | ${/title/i}       | ${'Please enter a title'}
  ${'Subtype'}     | ${/type/i}        | ${'Please choose a type'}
`('shows error message for missing value $title', async ({ label, error }) => {
  const { getByLabelText, findByText } = render(
    <TeamCreateOutputFormSharingCard {...props} />,
  );
  const input = getByLabelText(label);
  fireEvent.focusOut(input);
  expect(await findByText(error)).toBeVisible();
});

it('lab resource does not require an url', async () => {
  const { getByLabelText, findByText } = render(
    <TeamCreateOutputFormSharingCard {...props} type="Lab Resource" />,
  );
  expect(
    await findByText(
      (content, node) =>
        (content === 'URL' &&
          node?.nextSibling?.textContent?.includes('(optional)')) ??
        false,
    ),
  ).toBeVisible();

  const input = getByLabelText(/URL/i);
  fireEvent.focusOut(input);
  await expect(
    findByText('Please enter a valid URL, starting with http://'),
  ).rejects.toThrowError();
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

it.each`
  field                  | group                       | prop
  ${'asapFunded'}        | ${/funded by ASAP/i}        | ${'onChangeAsapFunded'}
  ${'usedInPublication'} | ${/used in a publication/i} | ${'onChangeUsedInPublication'}
  ${'sharingStatus'}     | ${/sharing status/i}        | ${'onChangeSharingStatus'}
`('triggers an onchange event for group $field', async ({ group, prop }) => {
  const onChangeFn = jest.fn();
  render(
    <TeamCreateOutputFormSharingCard {...{ ...props, [prop]: onChangeFn }} />,
  );

  fireEvent.click(
    screen.getByRole('group', { name: group }).querySelectorAll('input')[1]!,
  );

  expect(onChangeFn).toHaveBeenCalled();
});

it('triggers an on change for type', async () => {
  const onChangeFn = jest.fn();

  const { getByLabelText } = render(
    <TeamCreateOutputFormSharingCard
      {...props}
      type="Article"
      onChangeSubtypes={onChangeFn}
    />,
  );

  userEvent.type(getByLabelText(/type/i), 'Preprint');
  fireEvent.keyDown(getByLabelText(/type/i), {
    keyCode: ENTER_KEYCODE,
  });

  expect(onChangeFn).toHaveBeenCalledWith(['Preprint']);
});

it('shows the custom no options message for type', async () => {
  const { getByLabelText, getByText } = render(
    <TeamCreateOutputFormSharingCard {...props} type="Article" />,
  );

  userEvent.type(getByLabelText(/type/i), 'asdflkjasdflkj');

  expect(getByText('Sorry, no types match asdflkjasdflkj')).toBeVisible();
});

it('conditionally shows date published field', async () => {
  const { queryByLabelText, rerender } = render(
    <TeamCreateOutputFormSharingCard
      {...props}
      type="Article"
      sharingStatus={'Network Only'}
    />,
  );
  expect(queryByLabelText(/Date Published/i)).toBeNull();

  rerender(
    <TeamCreateOutputFormSharingCard
      {...props}
      type="Article"
      sharingStatus={'Public'}
    />,
  );
  expect(queryByLabelText(/Date Published/i)).toBeVisible();
});

it('triggers an on change for date published', async () => {
  const onChangeFn = jest.fn();

  const { getByLabelText } = render(
    <TeamCreateOutputFormSharingCard
      {...props}
      type="Article"
      sharingStatus={'Public'}
      onChangePublishDate={onChangeFn}
    />,
  );

  fireEvent.change(getByLabelText(/Date Published/i), {
    target: { value: '2020-12-02' },
  });
  expect(onChangeFn).toHaveBeenCalledWith(new Date('2020-12-02'));
});

it('shows the custom error message for date published', async () => {
  const { getByLabelText, getByText } = render(
    <TeamCreateOutputFormSharingCard
      {...props}
      type="Article"
      sharingStatus={'Public'}
      publishDate={startOfTomorrow()}
    />,
  );

  fireEvent.focusOut(getByLabelText(/Date Published/i));

  expect(getByText(/publish date cannot be greater than today/i)).toBeVisible();
});

it('displays server side validation error for link and calls clears function when changed', async () => {
  const mockClearError = jest.fn();
  const { getByLabelText, getByText } = render(
    <TeamCreateOutputFormSharingCard
      {...props}
      link="http://example.com"
      serverValidationErrors={[
        {
          instancePath: '/link',
          keyword: '',
          params: {},
          schemaPath: '',
        },
      ]}
      clearServerValidationError={mockClearError}
    />,
  );
  expect(
    getByText(
      'A Research Output with this URL already exists. Please enter a different URL.',
    ),
  ).toBeVisible();

  userEvent.type(getByLabelText(/URL/i), 'a');
  expect(mockClearError).toHaveBeenCalledWith('/link');
});
