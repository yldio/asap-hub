import { researchTagSubtypeResponse } from '@asap-hub/fixtures';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { editorRef, MultiSelectOptionsType } from '../../atoms';
import { OptionsType } from '../../select';
import { mockActErrorsInConsole } from '../../test-utils';
import { noop } from '../../utils';

import ResearchOutputFormSharingCard from '../ResearchOutputFormSharingCard';

const defaultProps: ComponentProps<typeof ResearchOutputFormSharingCard> = {
  showChangelog: true,
  showImpactAndCategory: true,
  disableImpactAndCategory: false,

  isFormSubmitted: false,
  link: '',
  title: '',
  descriptionMD: '',
  shortDescription: '',
  changelog: '',
  subtype: '',
  isSaving: false,
  researchTags: [],
  typeOptions: [],
  getShortDescriptionFromDescription: jest.fn(),
  onChangeLink: jest.fn(),
  onChangeTitle: jest.fn(),
  onChangeDescription: jest.fn(),
  onChangeShortDescription: jest.fn(),
  onChangeChangelog: jest.fn(),
  onChangeType: jest.fn(),
  onChangeSubtype: jest.fn(),
  getImpactSuggestions: jest.fn().mockResolvedValue([]),
  impact: undefined,
  onChangeImpact: jest.fn(),
  getCategorySuggestions: jest.fn().mockResolvedValue([]),
  categories: undefined,
  onChangeCategories: jest.fn(),
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
});

it('renders the card with provided values', () => {
  render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
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
  // Suppress act() warnings from TextField's internal async validation state updates
  const consoleMock = mockActErrorsInConsole();

  const { findByText } = render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      urlRequired
      typeOptions={['3D Printing']}
    />,
  );
  const input = screen.getByLabelText(label);
  await userEvent.click(input);
  await userEvent.tab();
  expect(await findByText(error)).toBeVisible();

  consoleMock.mockRestore();
});

it('does not require an url', async () => {
  render(
    <ResearchOutputFormSharingCard {...defaultProps} urlRequired={false} />,
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
  ).rejects.toThrow();
});

it.each`
  field      | label       | prop
  ${'Url'}   | ${/URL/i}   | ${'onChangeLink'}
  ${'Title'} | ${/title/i} | ${'onChangeTitle'}
`('triggers an onchange event for $field', async ({ label, prop }) => {
  const onChangeFn = jest.fn();
  render(
    <ResearchOutputFormSharingCard
      {...{ ...defaultProps, [prop]: onChangeFn }}
    />,
  );
  const input = screen.getByLabelText(label);
  fireEvent.change(input, { target: { value: 'test' } });
  expect(onChangeFn).toHaveBeenLastCalledWith('test');
});

it('triggers an onchange event for Description', async () => {
  const onChangeFn = jest.fn();
  render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      onChangeDescription={onChangeFn}
    />,
  );
  await waitFor(() => expect(editorRef.current).not.toBeNull());

  editorRef.current?.focus();
  const input = screen.getByTestId('editor');

  await userEvent.click(input);
  await userEvent.tab();
  fireEvent.input(input, { data: 'test' });

  await waitFor(() => {
    expect(onChangeFn).toHaveBeenLastCalledWith('test');
  });
});

it('triggers an onchange event for Short Description', async () => {
  // Suppress act() warnings from TextArea's internal async validation state updates
  const consoleMock = mockActErrorsInConsole();

  const onChangeFn = jest.fn();
  render(
    <ResearchOutputFormSharingCard
      {...{ ...defaultProps, onChangeShortDescription: onChangeFn }}
    />,
  );
  const input = screen.getByRole('textbox', { name: /short description/i });
  fireEvent.change(input, { target: { value: 'test' } });
  await waitFor(() => {
    expect(onChangeFn).toHaveBeenCalledWith('test');
  });

  consoleMock.mockRestore();
});

it('triggers an on change for type', async () => {
  const onChangeFn = jest.fn();

  render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      typeOptions={['Preprint', '3D Printing', 'ASAP subgroup meeting']}
      onChangeType={onChangeFn}
    />,
  );

  const type = screen.getByLabelText(/type/i);
  await userEvent.type(type, 'Preprint');
  await userEvent.type(type, '{Enter}');

  expect(onChangeFn).toHaveBeenCalledWith('Preprint');
});

it('triggers an on change for subtype', async () => {
  const onChangeFn = jest.fn();

  render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      researchTags={[researchTagSubtypeResponse]}
      onChangeSubtype={onChangeFn}
    />,
  );

  const type = screen.getByLabelText(/subtype/i);
  await userEvent.type(type, 'Metabolite');
  await userEvent.type(type, '{Enter}');

  expect(onChangeFn).toHaveBeenCalledWith('Metabolite');
});

it('shows the custom no options message for type', async () => {
  render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      typeOptions={['ASAP annual meeting', '3D Printing']}
    />,
  );

  await userEvent.type(screen.getByLabelText(/type/i), 'asdflkjasdflkj');

  expect(
    screen.getByText('Sorry, no types match asdflkjasdflkj'),
  ).toBeVisible();
});

it('displays server side validation error for link and calls clears function when changed', async () => {
  // Suppress act() warnings from TextField's internal async validation state updates
  const consoleMock = mockActErrorsInConsole();

  const mockClearError = jest.fn();
  render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
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

  const input = screen.getByLabelText(/URL/i);
  await userEvent.type(input, 'a');

  await waitFor(() => {
    expect(mockClearError).toHaveBeenCalledWith('/link');
  });

  consoleMock.mockRestore();
});

it('displays server side validation error for title and calls clears function when changed', async () => {
  // Suppress act() warnings from TextField's internal async validation state updates
  const consoleMock = mockActErrorsInConsole();

  const mockClearError = jest.fn();
  render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
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

  const input = screen.getByLabelText(/title/i);
  await userEvent.type(input, 'a');

  await waitFor(() => {
    expect(mockClearError).toHaveBeenCalledWith('/title');
  });

  consoleMock.mockRestore();
});

describe('Changelog validation', () => {
  it('shows validation message when changelog is empty', async () => {
    render(<ResearchOutputFormSharingCard {...defaultProps} />);

    const changelogInput = screen.getByRole('textbox', { name: /changelog/i });
    fireEvent.change(changelogInput, { target: { value: '  ' } });
    fireEvent.blur(changelogInput);

    expect(screen.getByText('Please enter a changelog')).toBeInTheDocument();
  });

  it('shows validation message when changelog exceeds 250 characters', async () => {
    render(<ResearchOutputFormSharingCard {...defaultProps} />);

    const longText = 'a'.repeat(251);
    const changelogInput = screen.getByRole('textbox', { name: /changelog/i });
    fireEvent.change(changelogInput, { target: { value: longText } });
    fireEvent.blur(changelogInput);

    expect(
      await screen.findByText(
        'The changelog exceeds the character limit. Please limit it to 250 characters.',
      ),
    ).toBeInTheDocument();
  });

  it('clears validation message when changelog is valid', async () => {
    render(<ResearchOutputFormSharingCard {...defaultProps} />);

    const validText = 'a'.repeat(100);
    const changelogInput = screen.getByRole('textbox', { name: /changelog/i });
    fireEvent.change(changelogInput, { target: { value: validText } });
    fireEvent.blur(changelogInput);

    expect(
      screen.queryByText('Please enter a changelog'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'The changelog exceeds the character limit. Please limit it to 250 characters.',
      ),
    ).not.toBeInTheDocument();
  });
});

it('renders the impact and categories', async () => {
  const loadOptions = jest.fn();
  loadOptions.mockResolvedValue([]);
  render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      getImpactSuggestions={loadOptions}
      getCategorySuggestions={loadOptions}
    />,
  );

  const impactInput = screen.getByRole('combobox', { name: /impact/i });
  expect(impactInput).toBeInTheDocument();

  const categoryInput = screen.getByRole('combobox', { name: /category/i });
  expect(categoryInput).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  fireEvent.change(categoryInput, { target: { value: 'Category' } });

  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  expect(
    screen.getByText(/no category options match Category/i),
  ).toBeInTheDocument();
});

it('renders category input and does not throw when getCategorySuggestions is noop', async () => {
  const { getCategorySuggestions, ...propsWithoutCategorySuggestions } =
    defaultProps;
  render(
    <ResearchOutputFormSharingCard
      {...propsWithoutCategorySuggestions}
      getCategorySuggestions={undefined}
    />,
  );

  const categoryInput = screen.getByRole('combobox', { name: /category/i });
  expect(categoryInput).toBeInTheDocument();

  fireEvent.change(categoryInput, { target: { value: 'Test' } });

  await waitFor(() => {
    expect(
      screen.queryByText(/no category options match/i),
    ).not.toBeInTheDocument();
  });
});

it('renders category input and does not throw when onChangeCategories is noop', async () => {
  const { onChangeCategories, ...propsWithoutOnChangeCategories } =
    defaultProps;
  render(
    <ResearchOutputFormSharingCard
      {...propsWithoutOnChangeCategories}
      onChangeCategories={noop}
    />,
  );

  const categoryInput = screen.getByRole('combobox', { name: /category/i });
  expect(categoryInput).toBeInTheDocument();

  fireEvent.change(categoryInput, { target: { value: 'Test' } });

  await waitFor(() => {
    expect(
      screen.queryByText(/no category options match/i),
    ).not.toBeInTheDocument();
  });
});

it('shows validation message when more than two categories are selected', async () => {
  const getCategorySuggestions = jest
    .fn()
    .mockResolvedValue([{ label: 'Cat 3', value: 'cat3' }]);

  const onChangeCategories = (
    newCategories: OptionsType<MultiSelectOptionsType>,
  ) => {
    rerender(
      <ResearchOutputFormSharingCard
        {...defaultProps}
        onChangeCategories={onChangeCategories}
        getCategorySuggestions={getCategorySuggestions}
        categories={newCategories}
      />,
    );
  };

  const { rerender } = render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      onChangeCategories={onChangeCategories}
      getCategorySuggestions={getCategorySuggestions}
      categories={[
        { label: 'Cat 1', value: 'cat1' },
        { label: 'Cat 2', value: 'cat2' },
      ]}
    />,
  );

  const categoryInput = screen.getByRole('combobox', { name: /category/i });
  expect(categoryInput).toBeInTheDocument();

  fireEvent.change(categoryInput, { target: { value: 'Cat' } });

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  fireEvent.keyDown(categoryInput, { key: 'ArrowDown' });
  fireEvent.keyDown(categoryInput, { key: 'Enter' });

  fireEvent.blur(categoryInput);

  expect(
    await screen.findByText('You can select up to two categories only.'),
  ).toBeInTheDocument();

  fireEvent.click(screen.getAllByTitle(/close/i)[0]!);
  fireEvent.blur(categoryInput);

  expect(
    screen.queryByText('You can select up to two categories only.'),
  ).not.toBeInTheDocument();
});

it('disables impact and category fields when disableImpactAndCategory is true', () => {
  const loadOptions = jest.fn();
  loadOptions.mockResolvedValue([]);

  const { rerender } = render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      getImpactSuggestions={loadOptions}
      getCategorySuggestions={loadOptions}
      disableImpactAndCategory={true}
    />,
  );
  expect(screen.getByLabelText(/impact\(required\)/i)).toBeDisabled();
  expect(screen.getByLabelText(/category/i)).toBeDisabled();

  rerender(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      getImpactSuggestions={loadOptions}
      getCategorySuggestions={loadOptions}
      isSaving={false}
      disableImpactAndCategory={false}
    />,
  );
  expect(screen.getByLabelText(/impact\(required\)/i)).toBeEnabled();
  expect(screen.getByLabelText(/category/i)).toBeEnabled();
});

it('calls onChangeImpact with the correct option when an impact is selected', async () => {
  const impactOptions = [
    { label: 'High Impact', value: 'high' },
    { label: 'Low Impact', value: 'low' },
  ];
  const getImpactSuggestions = jest.fn().mockResolvedValue(impactOptions);
  const onChangeImpact = jest.fn();

  render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      impact={undefined}
      onChangeImpact={onChangeImpact}
      getImpactSuggestions={getImpactSuggestions}
    />,
  );

  await waitFor(() => {
    expect(getImpactSuggestions).toHaveBeenCalled();
  });

  const impactField = screen.getByLabelText(/impact\(required\)/i);
  await userEvent.click(impactField);

  await waitFor(() => {
    expect(screen.getByText(/low impact/i)).toBeInTheDocument();
  });

  await userEvent.click(screen.getByText('Low Impact'));

  expect(onChangeImpact).toHaveBeenCalledWith(
    expect.objectContaining({ label: 'Low Impact', value: 'low' }),
  );
});

it('shows validation message when impact is not selected', async () => {
  const getImpactSuggestions = jest.fn().mockResolvedValue([
    { label: 'High Impact', value: 'high' },
    { label: 'Low Impact', value: 'low' },
  ]);

  render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      isFormSubmitted={true}
      impact={undefined}
      getImpactSuggestions={getImpactSuggestions}
    />,
  );

  await waitFor(() => {
    expect(
      screen.getByText('Please add at least one impact.'),
    ).toBeInTheDocument();
  });
});

it('does not show impact validation message when impact is selected', async () => {
  const getImpactSuggestions = jest.fn().mockResolvedValue([
    { label: 'High Impact', value: 'high' },
    { label: 'Low Impact', value: 'low' },
  ]);

  render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      isFormSubmitted={true}
      impact={{ label: 'High Impact', value: 'high' }}
      getImpactSuggestions={getImpactSuggestions}
    />,
  );

  await waitFor(() => {
    expect(
      screen.queryByText('Please add at least one impact.'),
    ).not.toBeInTheDocument();
  });
});

it('shows validation message when lay impact statement exceeds 100 characters', async () => {
  render(<ResearchOutputFormSharingCard {...defaultProps} />);

  const longText = 'a'.repeat(101);
  const layImpactInput = screen.getByRole('textbox', {
    name: /lay impact statement/i,
  });
  fireEvent.change(layImpactInput, { target: { value: longText } });
  fireEvent.blur(layImpactInput);

  expect(
    await screen.findByText(
      'The lay impact statement exceeds the character limit. Please limit it to 100 characters.',
    ),
  ).toBeInTheDocument();
});
