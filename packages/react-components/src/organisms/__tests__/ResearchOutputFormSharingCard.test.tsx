import { ResearchOutputSharingStatus } from '@asap-hub/model';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComponentProps } from 'react';
import { noop } from '../../utils';

import ResearchOutputFormSharingCard from '../ResearchOutputFormSharingCard';

const defaultProps: ComponentProps<typeof ResearchOutputFormSharingCard> = {
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
  getImpactSuggestions: jest.fn(),
  impact: undefined,
  onChangeImpact: jest.fn(),
  getCategorySuggestions: jest.fn(),
  categories: undefined,
  onChangeCategories: jest.fn(),
  isCreatingNewVersion: false,
};

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

  fireEvent.change(impactInput, { target: { value: 'Impact' } });

  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  expect(
    screen.getByText(/no impact options match Impact/i),
  ).toBeInTheDocument();

  fireEvent.change(categoryInput, { target: { value: 'Category' } });

  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  expect(
    screen.getByText(/no category options match Category/i),
  ).toBeInTheDocument();
});

it('renders impact input and does not throw when getImpactSuggestions is noop', async () => {
  const { getImpactSuggestions, ...propsWithoutImpactSuggestions } =
    defaultProps;
  render(
    <ResearchOutputFormSharingCard
      {...propsWithoutImpactSuggestions}
      documentType="Article"
      getImpactSuggestions={undefined}
    />,
  );

  const impactInput = screen.getByRole('textbox', { name: /impact/i });
  expect(impactInput).toBeInTheDocument();

  fireEvent.change(impactInput, { target: { value: 'Test' } });

  await waitFor(() => {
    expect(
      screen.queryByText(/no impact options match/i),
    ).not.toBeInTheDocument();
  });
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
  const onChangeCategories = jest.fn();
  const getCategorySuggestions = jest
    .fn()
    .mockResolvedValue([{ label: 'Cat 3', value: 'cat3' }]);
  render(
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

  expect(onChangeCategories).toHaveBeenCalled();

  expect(
    await screen.findByText('Please select up to two categories'),
  ).toBeInTheDocument();

  fireEvent.click(screen.getAllByTitle(/close/i)[0]!);

  expect(
    screen.queryByText('Please select up to two categories'),
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
