import { ResearchOutputSharingStatus } from '@asap-hub/model';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { OptionsType } from 'react-select';
import { MultiSelectOptionsType } from '../../atoms';
import { noop } from '../../utils';

import ResearchOutputFormSharingCard from '../ResearchOutputFormSharingCard';

const defaultProps: ComponentProps<typeof ResearchOutputFormSharingCard> = {
  isFormSubmitted: false,
  documentType: 'Bioinformatics',
  link: '',
  title: '',
  descriptionMD: '',
  shortDescription: '',
  changelog: '',
  sharingStatus: 'Network Only' as ResearchOutputSharingStatus,
  subtype: '',
  displayChangelog: true,
  isSaving: false,
  asapFunded: 'No' as const,
  usedInPublication: 'No' as const,
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
  onChangeAsapFunded: jest.fn(),
  onChangeUsedInPublication: jest.fn(),
  onChangeSharingStatus: jest.fn(),
  onChangePublishDate: jest.fn(),
  getImpactSuggestions: jest.fn().mockResolvedValue([]),
  impact: undefined,
  onChangeImpact: jest.fn(),
  getCategorySuggestions: jest.fn().mockResolvedValue([]),
  categories: undefined,
  onChangeCategories: jest.fn(),
  isCreatingNewVersion: false,
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
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
      documentType="Article"
      getImpactSuggestions={loadOptions}
      getCategorySuggestions={loadOptions}
    />,
  );

  const impactInput = screen.getByRole('textbox', { name: /impact/i });
  expect(impactInput).toBeInTheDocument();

  const categoryInput = screen.getByRole('textbox', { name: /category/i });
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
      documentType="Article"
      getCategorySuggestions={undefined}
    />,
  );

  const categoryInput = screen.getByRole('textbox', { name: /category/i });
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
      documentType="Article"
      onChangeCategories={noop}
    />,
  );

  const categoryInput = screen.getByRole('textbox', { name: /category/i });
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
        documentType="Article"
        onChangeCategories={onChangeCategories}
        getCategorySuggestions={getCategorySuggestions}
        categories={newCategories}
      />,
    );
  };

  const { rerender } = render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      documentType="Article"
      onChangeCategories={onChangeCategories}
      getCategorySuggestions={getCategorySuggestions}
      categories={[
        { label: 'Cat 1', value: 'cat1' },
        { label: 'Cat 2', value: 'cat2' },
      ]}
    />,
  );

  const categoryInput = screen.getByRole('textbox', { name: /category/i });
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

it('disables impact and category fields when isCreatingNewVersion is true', () => {
  const loadOptions = jest.fn();
  loadOptions.mockResolvedValue([]);

  const { rerender } = render(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      documentType="Article"
      getImpactSuggestions={loadOptions}
      getCategorySuggestions={loadOptions}
      isCreatingNewVersion={true}
    />,
  );
  expect(screen.getByLabelText(/impact/i)).toBeDisabled();
  expect(screen.getByLabelText(/category/i)).toBeDisabled();

  rerender(
    <ResearchOutputFormSharingCard
      {...defaultProps}
      documentType="Article"
      getImpactSuggestions={loadOptions}
      getCategorySuggestions={loadOptions}
      isSaving={false}
      isCreatingNewVersion={false}
    />,
  );
  expect(screen.getByLabelText(/impact/i)).toBeEnabled();
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
      documentType="Article"
      impact={undefined}
      onChangeImpact={onChangeImpact}
      getImpactSuggestions={getImpactSuggestions}
    />,
  );

  await waitFor(() => {
    expect(getImpactSuggestions).toHaveBeenCalled();
  });

  const impactField = screen.getByLabelText(/impact/i);
  userEvent.click(impactField);

  await waitFor(() => {
    expect(screen.getByText(/low impact/i)).toBeInTheDocument();
  });

  userEvent.click(screen.getByText('Low Impact'));

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
      documentType="Article"
      isFormSubmitted={true}
      impact={undefined}
      getImpactSuggestions={getImpactSuggestions}
    />,
  );

  await waitFor(() => {
    expect(screen.getByText('Please choose an impact.')).toBeInTheDocument();
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
      documentType="Article"
      isFormSubmitted={true}
      impact={{ label: 'High Impact', value: 'high' }}
      getImpactSuggestions={getImpactSuggestions}
    />,
  );

  await waitFor(() => {
    expect(
      screen.queryByText('Please choose an impact.'),
    ).not.toBeInTheDocument();
  });
});
