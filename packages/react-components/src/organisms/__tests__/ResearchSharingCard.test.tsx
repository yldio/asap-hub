import { fireEvent } from '@testing-library/dom';
import { render, screen, within } from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { startOfTomorrow } from 'date-fns';
import { ComponentProps } from 'react';
import ResearchOutputFormSharingCard from '../ResearchOutputFormSharingCard';

const props: ComponentProps<typeof ResearchOutputFormSharingCard> = {
  description: '',
  isSaving: false,
  title: '',
  link: '',
  type: '',
  documentType: 'Article',
  asapFunded: 'Not Sure',
  usedInPublication: 'Not Sure',
  sharingStatus: 'Network Only',
};
it('renders the card with provided values', () => {
  render(
    <ResearchOutputFormSharingCard
      {...props}
      documentType="Article"
      description="description"
      link="http://example.com"
      title="title"
      type={'Preprint'}
    />,
  );
  expect(screen.getByDisplayValue('description')).toBeVisible();
  expect(screen.getByDisplayValue('http://example.com')).toBeVisible();
  expect(screen.getByDisplayValue('title')).toBeVisible();
  expect(screen.getByText('Preprint')).toBeVisible();
});

it.each`
  title            | label             | error
  ${'Description'} | ${/description/i} | ${'Please enter a description'}
  ${'Url'}         | ${/URL/i}         | ${'Please enter a valid URL, starting with http://'}
  ${'Title'}       | ${/title/i}       | ${'Please enter a title'}
  ${'Type'}        | ${/type/i}        | ${'Please choose a type'}
`('shows error message for missing value $title', async ({ label, error }) => {
  render(<ResearchOutputFormSharingCard {...props} />);
  const input = screen.getByLabelText(label);
  fireEvent.focusOut(input);
  expect(await screen.findByText(error)).toBeVisible();
});

it('lab resource does not require an url', async () => {
  render(
    <ResearchOutputFormSharingCard {...props} documentType="Lab Resource" />,
  );
  expect(
    await screen.findByText(
      (content, node) =>
        (content === 'URL' &&
          node?.nextSibling?.textContent?.includes('(optional)')) ??
        false,
    ),
  ).toBeVisible();

  const input = screen.getByLabelText(/URL/i);
  fireEvent.focusOut(input);
  await expect(
    screen.findByText('Please enter a valid URL, starting with http://'),
  ).rejects.toThrowError();
});

it.each`
  field            | label             | prop
  ${'Description'} | ${/description/i} | ${'onChangeDescription'}
  ${'Url'}         | ${/URL/i}         | ${'onChangeLink'}
  ${'Title'}       | ${/title/i}       | ${'onChangeTitle'}
`('triggers an onchange event for $field', async ({ label, prop }) => {
  const onChangeFn = jest.fn();
  render(
    <ResearchOutputFormSharingCard {...{ ...props, [prop]: onChangeFn }} />,
  );
  const input = screen.getByLabelText(label);
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
    <ResearchOutputFormSharingCard {...{ ...props, [prop]: onChangeFn }} />,
  );

  const groupInput = within(
    screen.getByRole('group', { name: group }),
  ).getAllByRole('radio')[1];

  userEvent.click(groupInput);

  expect(onChangeFn).toHaveBeenCalled();
});

it('triggers an on change for type', async () => {
  const onChangeFn = jest.fn();

  render(
    <ResearchOutputFormSharingCard
      {...props}
      documentType="Article"
      onChangeType={onChangeFn}
    />,
  );

  const type = screen.getByLabelText(/type/i);
  userEvent.type(type, 'Preprint');
  userEvent.type(type, specialChars.enter);

  expect(onChangeFn).toHaveBeenCalledWith('Preprint');
});

it('shows the custom no options message for type', async () => {
  render(<ResearchOutputFormSharingCard {...props} documentType="Article" />);

  userEvent.type(screen.getByLabelText(/type/i), 'asdflkjasdflkj');

  expect(
    screen.getByText('Sorry, no types match asdflkjasdflkj'),
  ).toBeVisible();
});

it('conditionally shows date published field', async () => {
  const { rerender } = render(
    <ResearchOutputFormSharingCard
      {...props}
      documentType="Article"
      sharingStatus={'Network Only'}
    />,
  );
  expect(screen.queryByLabelText(/Date Published/i)).not.toBeInTheDocument();

  rerender(
    <ResearchOutputFormSharingCard
      {...props}
      documentType="Article"
      sharingStatus={'Public'}
    />,
  );
  expect(screen.queryByLabelText(/Date Published/i)).toBeVisible();
});

it('triggers an on change for date published', async () => {
  const onChangeFn = jest.fn();

  render(
    <ResearchOutputFormSharingCard
      {...props}
      documentType="Article"
      sharingStatus={'Public'}
      onChangePublishDate={onChangeFn}
    />,
  );

  userEvent.type(screen.getByLabelText(/Date Published/i), '2020-12-02');
  expect(onChangeFn).toHaveBeenCalledWith(new Date('2020-12-02'));
});

it('shows the custom error message for date published', async () => {
  render(
    <ResearchOutputFormSharingCard
      {...props}
      documentType="Article"
      sharingStatus={'Public'}
      publishDate={startOfTomorrow()}
    />,
  );
  screen.getByLabelText(/Date Published/i).click();
  userEvent.tab();

  expect(
    screen.getByText(/publish date cannot be greater than today/i),
  ).toBeVisible();
});

it('displays server side validation error for link and calls clears function when changed', async () => {
  const mockClearError = jest.fn();
  render(
    <ResearchOutputFormSharingCard
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
    screen.getByText(
      'A Research Output with this URL already exists. Please enter a different URL.',
    ),
  ).toBeVisible();

  userEvent.type(screen.getByLabelText(/URL/i), 'a');
  expect(mockClearError).toHaveBeenCalledWith('/link');
});

it('displays server side validation error for title and calls clears function when changed', async () => {
  const mockClearError = jest.fn();
  render(
    <ResearchOutputFormSharingCard
      {...props}
      title="Example"
      serverValidationErrors={[
        {
          instancePath: '/title',
          keyword: '',
          params: {},
          schemaPath: '',
        },
      ]}
      clearServerValidationError={mockClearError}
    />,
  );
  expect(
    screen.getByText(
      'A Research Output with this title already exists. Please check if this is repeated and choose a different title.',
    ),
  ).toBeVisible();

  userEvent.type(screen.getByLabelText(/title/i), 'a');
  expect(mockClearError).toHaveBeenCalledWith('/title');
});
