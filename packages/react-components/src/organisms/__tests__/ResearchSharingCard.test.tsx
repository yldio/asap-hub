import { researchTagSubtypeResponse } from '@asap-hub/fixtures';
import { fireEvent } from '@testing-library/dom';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { startOfTomorrow } from 'date-fns';
import { ComponentProps } from 'react';
import ResearchOutputFormSharingCard, {
  getPublishDateValidationMessage,
} from '../ResearchOutputFormSharingCard';

const props: ComponentProps<typeof ResearchOutputFormSharingCard> = {
  isFormSubmitted: false,
  descriptionMD: '',
  shortDescription: '',
  isSaving: false,
  title: '',
  link: '',
  type: '',
  asapFunded: 'Not Sure',
  usedInPublication: 'Not Sure',
  sharingStatus: 'Network Only',
  researchTags: [],
  typeOptions: [],
  getShortDescriptionFromDescription: jest.fn(),
  getImpactSuggestions: jest.fn(),
  impact: undefined,
  onChangeImpact: jest.fn(),
  getCategorySuggestions: jest.fn(),
  categories: undefined,
  onChangeCategories: jest.fn(),
  isCreatingNewVersion: false,
};
it('renders the card with provided values', () => {
  // TODO: fix act error
  jest.spyOn(console, 'error').mockImplementation();
  render(
    <ResearchOutputFormSharingCard
      {...props}
      descriptionMD="description text"
      link="http://example.com"
      title="title"
      type={'Preprint'}
      typeOptions={['Preprint', '3D Printing']}
    />,
  );
  expect(screen.getAllByText('description text')[0]).toBeVisible();
  expect(screen.getByDisplayValue('http://example.com')).toBeVisible();
  expect(screen.getByDisplayValue('title')).toBeVisible();
  expect(screen.getByText('Preprint')).toBeVisible();
});

it.each`
  title      | label       | error
  ${'Url'}   | ${/URL/i}   | ${'Please enter a valid URL, starting with http://'}
  ${'Title'} | ${/title/i} | ${'Please enter a title'}
  ${'Type'}  | ${/type/i}  | ${'Please choose a type'}
`('shows error message for missing value $title', async ({ label, error }) => {
  render(
    <ResearchOutputFormSharingCard
      {...props}
      urlRequired
      typeOptions={['3D Printing']}
    />,
  );
  const input = screen.getByLabelText(label);
  fireEvent.focusOut(input);
  expect(await screen.findByText(error)).toBeVisible();
});

it('does not require an url', async () => {
  render(<ResearchOutputFormSharingCard {...props} urlRequired={false} />);
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
  ).rejects.toThrow();
});

it.each`
  field      | label       | prop
  ${'Url'}   | ${/URL/i}   | ${'onChangeLink'}
  ${'Title'} | ${/title/i} | ${'onChangeTitle'}
`('triggers an onchange event for $field', async ({ label, prop }) => {
  const onChangeFn = jest.fn();
  render(
    <ResearchOutputFormSharingCard {...{ ...props, [prop]: onChangeFn }} />,
  );
  const input = screen.getByLabelText(label);
  fireEvent.change(input, { target: { value: 'test' } });
  expect(onChangeFn).toHaveBeenLastCalledWith('test');
});

it('triggers an onchange event for Description', async () => {
  const onChangeFn = jest.fn();
  render(
    <ResearchOutputFormSharingCard
      {...props}
      onChangeDescription={onChangeFn}
    />,
  );
  const input = screen.getByTestId('editor');

  userEvent.click(input);
  userEvent.tab();
  fireEvent.input(input, { data: 'test' });

  await waitFor(() => {
    expect(onChangeFn).toHaveBeenLastCalledWith('test');
  });
});

it('triggers an onchange event for Short Description', async () => {
  const onChangeFn = jest.fn();
  render(
    <ResearchOutputFormSharingCard
      {...{ ...props, onChangeShortDescription: onChangeFn }}
    />,
  );
  const input = screen.getByRole('textbox', { name: /short description/i });
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

  userEvent.click(groupInput!);

  expect(onChangeFn).toHaveBeenCalled();
});

it('triggers an on change for type', async () => {
  const onChangeFn = jest.fn();

  render(
    <ResearchOutputFormSharingCard
      {...props}
      typeOptions={['Preprint', '3D Printing', 'ASAP subgroup meeting']}
      onChangeType={onChangeFn}
    />,
  );

  const type = screen.getByLabelText(/type/i);
  userEvent.type(type, 'Preprint');
  userEvent.type(type, '{enter}');

  expect(onChangeFn).toHaveBeenCalledWith('Preprint');
});

it('triggers an on change for subtype', async () => {
  const onChangeFn = jest.fn();

  render(
    <ResearchOutputFormSharingCard
      {...props}
      researchTags={[researchTagSubtypeResponse]}
      onChangeSubtype={onChangeFn}
    />,
  );

  const type = screen.getByLabelText(/subtype/i);
  userEvent.type(type, 'Metabolite');
  userEvent.type(type, '{enter}');

  expect(onChangeFn).toHaveBeenCalledWith('Metabolite');
});

it('shows the custom no options message for type', async () => {
  render(
    <ResearchOutputFormSharingCard
      {...props}
      typeOptions={['ASAP annual meeting', '3D Printing']}
    />,
  );

  userEvent.type(screen.getByLabelText(/type/i), 'asdflkjasdflkj');

  expect(
    screen.getByText('Sorry, no types match asdflkjasdflkj'),
  ).toBeVisible();
});

it('conditionally shows date published field', async () => {
  const { rerender } = render(
    <ResearchOutputFormSharingCard {...props} sharingStatus={'Network Only'} />,
  );
  expect(screen.queryByLabelText(/Date Published/i)).not.toBeInTheDocument();

  rerender(
    <ResearchOutputFormSharingCard {...props} sharingStatus={'Public'} />,
  );
  expect(screen.queryByLabelText(/Date Published/i)).toBeVisible();
});

it('triggers an on change for date published', async () => {
  const onChangeFn = jest.fn();

  render(
    <ResearchOutputFormSharingCard
      {...props}
      sharingStatus={'Public'}
      onChangePublishDate={onChangeFn}
    />,
  );

  userEvent.type(screen.getByLabelText(/Date Published/i), '2020-12-02');
  expect(onChangeFn).toHaveBeenCalledWith(new Date('2020-12-02'));
});

it('shows the custom error message for a date in the future', async () => {
  render(
    <ResearchOutputFormSharingCard
      {...props}
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

describe('getPublishDateValidationMessage returns', () => {
  const e: ValidityState = {
    badInput: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: false,
    valueMissing: false,
    customError: false,
    patternMismatch: false,
  };

  it('a message when the date is in the future', () => {
    expect(
      getPublishDateValidationMessage({ ...e, rangeOverflow: true }),
    ).toEqual('Publish date cannot be greater than today');
  });

  it('a message when the date is invalid', () => {
    expect(getPublishDateValidationMessage({ ...e, badInput: true })).toEqual(
      'Date published should be complete or removed',
    );
  });
});
