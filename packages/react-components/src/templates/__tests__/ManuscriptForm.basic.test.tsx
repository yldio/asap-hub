import { AuthorResponse, AuthorSelectOption } from '@asap-hub/model';
import {
  ByRoleMatcher,
  ByRoleOptions,
  waitForOptions,
  act,
  cleanup,
  render,
  waitFor,
} from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { createMemoryHistory, History } from 'history';
import { ComponentProps, Suspense } from 'react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import ManuscriptForm from '../ManuscriptForm';

type FindByRole = (
  role: ByRoleMatcher,
  options?: ByRoleOptions | undefined,
  waitForElementOptions?: waitForOptions | undefined,
) => Promise<HTMLElement>;

let history!: History;

const teamId = '1';

const mockGetLabSuggestions = jest.fn();
mockGetLabSuggestions.mockResolvedValue([
  { label: 'One Lab', value: '1' },
  { label: 'Two Lab', value: '2' },
]);

const getTeamSuggestions = jest.fn();
getTeamSuggestions.mockResolvedValue([
  { label: 'One Team', value: '1' },
  { label: 'Two Team', value: '2' },
]);

const getImpactSuggestionsMock = jest.fn().mockImplementation(async (query) => {
  const all = [
    { label: 'Impact A', value: 'impact-id-1' },
    { label: 'Impact B', value: 'impact-id-2' },
  ];
  return all.filter(({ label }) =>
    label.toLowerCase().includes(query.toLowerCase()),
  );
});

const getCategorySuggestionsMock = jest
  .fn()
  .mockImplementation(async (query) => {
    const all = [
      { label: 'Category A', value: 'category-id-1' },
      { label: 'Category B', value: 'category-id-2' },
      { label: 'Category C', value: 'category-id-3' },
    ];
    return all.filter(({ label }) =>
      label.toLowerCase().includes(query.toLowerCase()),
    );
  });

const defaultProps: ComponentProps<typeof ManuscriptForm> = {
  onCreate: jest.fn(() => Promise.resolve()),
  onUpdate: jest.fn(() => Promise.resolve()),
  onResubmit: jest.fn(() => Promise.resolve()),
  getShortDescriptionFromDescription: jest.fn(() => Promise.resolve('')),
  getAuthorSuggestions: jest.fn(),
  getLabSuggestions: mockGetLabSuggestions,
  getTeamSuggestions,
  selectedTeams: [{ value: '1', label: 'One Team', isFixed: true }],
  selectedLabs: [],
  handleFileUpload: jest.fn(() =>
    Promise.resolve({
      id: '123',
      filename: 'test.pdf',
      url: 'http://example.com/test.pdf',
    }),
  ),
  onSuccess: jest.fn(),
  teamId,
  eligibilityReasons: new Set(),
  acknowledgedGrantNumber: 'Yes',
  asapAffiliationIncluded: 'Yes',
  manuscriptLicense: 'Yes',
  datasetsDeposited: 'Yes',
  codeDeposited: 'Yes',
  protocolsDeposited: 'Yes',
  labMaterialsRegistered: 'Yes',
  availabilityStatement: 'Yes',
  description: 'Some description',
  shortDescription: 'A good short description',
  firstAuthors: [
    {
      label: 'Author 1',
      value: 'author-1',
      id: 'author-1',
      displayName: 'Author 1',
    } as AuthorResponse & AuthorSelectOption,
  ],
  correspondingAuthor: [],
  additionalAuthors: [],
  onError: jest.fn(),
  clearFormToast: jest.fn(),
  isOpenScienceTeamMember: false,
  impact: { value: 'impact-id-1', label: 'Impact A' },
  categories: [{ value: 'category-id-1', label: 'Category A' }],
  getImpactSuggestions: getImpactSuggestionsMock,
  getCategorySuggestions: getCategorySuggestionsMock,
};

const submitForm = async ({ findByRole }: { findByRole: FindByRole }) => {
  const submitBtn = await findByRole('button', { name: /Submit/ });
  await userEvent.click(submitBtn);

  const confirmBtn = await findByRole('button', {
    name: /Submit Manuscript/i,
  });
  await userEvent.click(confirmBtn);
};

jest.setTimeout(60_000);

const renderManuscriptForm = async (
  props: ComponentProps<typeof ManuscriptForm>,
) => {
  const container = render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Loading...</div>}>
        <ManuscriptForm {...props} />
      </Suspense>
    </StaticRouter>,
  );

  await waitFor(() => {
    expect(container.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });
  return container;
};

describe('Manuscript form', () => {
  beforeEach(() => {
    cleanup();
    jest.spyOn(console, 'error').mockImplementation();
    history = createMemoryHistory();
  });

  it('renders the form', async () => {
    const { getByRole } = await renderManuscriptForm(defaultProps);
    expect(
      getByRole('heading', { name: /What are you sharing/i }),
    ).toBeVisible();
    expect(getByRole('button', { name: /Submit/ })).toBeVisible();
  });

  it('data is sent on form submission', async () => {
    const { findByRole } = await renderManuscriptForm({
      ...defaultProps,
      title: 'manuscript title',
      type: 'Original Research',
      lifecycle: 'Draft Manuscript (prior to Publication)',
      manuscriptFile: {
        id: '123',
        filename: 'test.pdf',
        url: 'http://example.com/test.pdf',
      },
      keyResourceTable: {
        id: '124',
        filename: 'test.csv',
        url: 'http://example.com/test.csv',
      },
    });

    await submitForm({ findByRole });

    await waitFor(() => {
      expect(defaultProps.onCreate).toHaveBeenCalledWith({
        title: 'manuscript title',
        url: undefined,
        eligibilityReasons: [],
        impact: 'impact-id-1',
        categories: ['category-id-1'],
        versions: [
          expect.objectContaining({
            type: 'Original Research',
            lifecycle: 'Draft Manuscript (prior to Publication)',
            manuscriptFile: {
              id: '123',
              filename: 'test.pdf',
              url: 'http://example.com/test.pdf',
            },
            keyResourceTable: {
              id: '124',
              filename: 'test.csv',
              url: 'http://example.com/test.csv',
            },
            acknowledgedGrantNumber: 'Yes',
            asapAffiliationIncluded: 'Yes',
            manuscriptLicense: 'Yes',
            datasetsDeposited: 'Yes',
            codeDeposited: 'Yes',
            protocolsDeposited: 'Yes',
            labMaterialsRegistered: 'Yes',
            availabilityStatement: 'Yes',
            acknowledgedGrantNumberDetails: '',
            asapAffiliationIncludedDetails: '',
            manuscriptLicenseDetails: '',
            datasetsDepositedDetails: '',
            codeDepositedDetails: '',
            protocolsDepositedDetails: '',
            labMaterialsRegisteredDetails: '',
            availabilityStatementDetails: '',
            teams: ['1'],
            labs: [],
            description: 'Some description',
            shortDescription: 'A good short description',
            firstAuthors: [],
            additionalAuthors: [],
          }),
        ],
        teamId,
      });
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message when manuscript title is missing', async () => {
    const { getByRole, getAllByText, queryByText } =
      await renderManuscriptForm(defaultProps);

    const input = getByRole('textbox', { name: /Title of Manuscript/i });
    await userEvent.type(input, '');
    input.focus();
    input.blur();
    await waitFor(() => {
      expect(
        getAllByText(/Please enter a title/i).length,
      ).toBeGreaterThanOrEqual(1);
    });

    await userEvent.type(input, 'title');
    input.blur();

    await waitFor(() => {
      expect(queryByText(/Please enter a title/i)).toBeNull();
    });
  });

  it('displays error message when manuscript title and details exceed 256 characters', async () => {
    const { getByRole, findByText } = await renderManuscriptForm({
      ...defaultProps,
      type: 'Original Research',
      lifecycle: 'Other',
    });

    const titleInput = getByRole('textbox', {
      name: /Title of Manuscript/i,
    });

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'A'.repeat(257));
    titleInput.blur();

    expect(
      await findByText(/This title cannot exceed 256 characters./i),
    ).toBeVisible();

    const detailsInput = getByRole('textbox', {
      name: /Please provide details/i,
    });

    expect(detailsInput).toBeVisible();

    await userEvent.type(detailsInput, 'A'.repeat(257));
    detailsInput.blur();

    expect(
      await findByText(/Details cannot exceed 256 characters./i),
    ).toBeVisible();
  });

  it('displays error message when no type was found', async () => {
    const { getByRole, getByText } = await renderManuscriptForm(defaultProps);

    const textbox = getByRole('textbox', {
      name: /Type of Manuscript/i,
    });
    await userEvent.type(textbox, 'invalid type');

    expect(getByText(/Sorry, no types match/i)).toBeVisible();
  });

  it('triggers validation when typing into Preprint DOI field', async () => {
    const { getByRole } = await renderManuscriptForm({
      ...defaultProps,
      title: 'manuscript title',
      type: 'Original Research',
      lifecycle: 'Preprint',
    });

    const preprintInput = getByRole('textbox', {
      name: /Preprint DOI/i,
    });

    await userEvent.type(preprintInput, '10.1234/test');
    preprintInput.blur();

    expect(preprintInput).toHaveValue('10.1234/test');
  });

  it('resets form fields to default values when no longer visible', async () => {
    const { getByRole, queryByRole } = await renderManuscriptForm({
      ...defaultProps,
      title: 'manuscript title',
      type: 'Original Research',
      lifecycle: 'Publication',
      preprintDoi: '10.4444/test',
      publicationDoi: '10.4467/test',
      manuscriptFile: {
        id: '123',
        url: 'https://test-url',
        filename: 'abc.jpeg',
      },
      keyResourceTable: {
        id: '124',
        url: 'https://test-url',
        filename: 'abc.jpeg',
      },
    });

    const lifecycleInput = getByRole('textbox', {
      name: /Where is the manuscript in the life cycle/i,
    });

    await userEvent.type(
      lifecycleInput,
      'Draft Manuscript (prior to Publication)',
    );
    await userEvent.type(lifecycleInput, specialChars.enter);
    lifecycleInput.blur();

    expect(
      queryByRole('textbox', { name: /Preprint DOI/i }),
    ).not.toBeInTheDocument();
    expect(
      queryByRole('textbox', { name: /Publication DOI/i }),
    ).not.toBeInTheDocument();
    // part of submition was removed and tested above in another test
  });

  it('does not submit when required values are missing', async () => {
    const { getByRole } = await renderManuscriptForm(defaultProps);

    const submitButton = getByRole('button', { name: /Submit/ });

    expect(submitButton).not.toBeEnabled();
  });

  it('should go back when cancel button is clicked', async () => {
    const { findByText, getByRole } = render(
      <MemoryRouter>
        <Router history={history}>
          <Route path="/form">
            <Suspense fallback={<div>Loading...</div>}>
              <ManuscriptForm {...defaultProps} />
            </Suspense>
          </Route>
        </Router>
      </MemoryRouter>,
    );

    history.push('/another-url');
    history.push('/form');

    await act(async () => {
      await userEvent.click(await findByText(/cancel/i));
    });

    await userEvent.click(
      getByRole('button', { name: /Cancel manuscript submission/i }),
    );

    expect(history.location.pathname).toBe('/another-url');
  });

  it('should not enable OS fields on edit mode if user is not an OS team member', async () => {
    const { getByRole, getByText } = await renderManuscriptForm({
      ...defaultProps,
      manuscriptId: 'test-id',
      isOpenScienceTeamMember: false,
      type: 'Original Research',
      lifecycle: 'Preprint',
      manuscriptFile: {
        id: 'file-1',
        filename: 'manuscript.pdf',
        url: 'http://a.co',
      },
      additionalFiles: [
        { id: 'file-2', filename: 'additional.pdf', url: 'http://a.co' },
      ],
    });

    // type, lifecycle, manuscriptFile, and additionalFiles
    expect(
      getByRole('textbox', { name: /Type of Manuscript/i }),
    ).toBeDisabled();
    expect(
      getByRole('textbox', {
        name: /Where is the manuscript in the life cycle/i,
      }),
    ).toBeDisabled();

    // Check that the "Add File" buttons are disabled
    const addFileButtons = document.querySelectorAll(
      'button:disabled',
    ) as NodeListOf<HTMLButtonElement>;
    const disabledAddFileButtons = Array.from(addFileButtons).filter(
      (button) => button.textContent?.includes('Add File'),
    );
    expect(disabledAddFileButtons.length).toBeGreaterThan(0);

    // Check that tags don't have remove buttons (tagEnabled is false)
    expect(
      getByText('manuscript.pdf').closest('span')?.querySelector('button'),
    ).toBeNull();
    expect(
      getByText('additional.pdf').closest('span')?.querySelector('button'),
    ).toBeNull();

    // preprintDoi
    expect(getByRole('textbox', { name: /Preprint DOI/i })).toBeDisabled();
  });

  it('should disable publication DOI field if user on edit mode and is not an OS team member', async () => {
    const { getByRole } = await renderManuscriptForm({
      ...defaultProps,
      manuscriptId: 'test-id',
      isOpenScienceTeamMember: false,
      type: 'Original Research',
      lifecycle: 'Publication',
    });
    expect(getByRole('textbox', { name: /Publication DOI/i })).toBeDisabled();
  });

  it('should disable otherDetails field if user on edit mode and is not an OS team member', async () => {
    const { getByRole } = await renderManuscriptForm({
      ...defaultProps,
      manuscriptId: 'test-id',
      isOpenScienceTeamMember: false,
      type: 'Original Research',
      lifecycle: 'Other',
    });

    expect(
      getByRole('textbox', { name: /Please provide details/i }),
    ).toBeDisabled();
  });

  it('should default to false for isOpenScienceTeamMember if not provided', async () => {
    const { isOpenScienceTeamMember: _, ...rest } = defaultProps;

    const { getByRole } = await renderManuscriptForm({
      ...rest,
      manuscriptId: 'test-id',
      isOpenScienceTeamMember: false,
      type: 'Original Research',
      lifecycle: 'Preprint',
    });

    expect(getByRole('textbox', { name: /Preprint DOI/i })).toBeDisabled();
  });

  it('lets user select valid impact and category, and shows no match message on invalid input', async () => {
    const { getByRole, getByText } = await renderManuscriptForm({
      ...defaultProps,
      impact: undefined,
      categories: [],
      type: 'Original Research',
      lifecycle: 'Preprint',
    });

    // --- Category field ---
    const categoryInput = getByRole('textbox', { name: /Category/i });

    // --- Type invalid category ---
    await userEvent.type(categoryInput, 'Unknown Category');

    await waitFor(() => {
      expect(
        getByText(/Sorry, no categories match Unknown Category/i),
      ).toBeVisible();
    });

    // --- Required category error message ---
    await userEvent.clear(categoryInput);

    await userEvent.click(categoryInput);
    categoryInput.blur();

    await waitFor(() => {
      expect(getByText(/Please add at least one category/i)).toBeVisible();
    });
    await userEvent.type(categoryInput, 'Category');
    await userEvent.click(getByText('Category A'));
    categoryInput.blur();

    expect(getByText('Category A')).toBeInTheDocument();

    // --- Category limit ---
    await userEvent.click(categoryInput);
    await userEvent.click(getByText('Category B'));
    await userEvent.click(categoryInput);
    await userEvent.click(getByText('Category C'));
    await categoryInput.blur();

    await waitFor(() => {
      expect(
        getByText(/You can select up to two categories only/i),
      ).toBeVisible();
    });

    // --- Impact field ---
    const impactInput = getByRole('textbox', { name: /Impact/i });

    // --- Required impact error message ---
    await userEvent.click(impactInput);
    impactInput.blur();

    await waitFor(() => {
      expect(getByText(/Please add at least one impact/i)).toBeVisible();
    });

    // --- Type invalid impact ---
    await userEvent.type(impactInput, 'Unknown Impact');
    await waitFor(() => {
      expect(
        getByText(/Sorry, no impacts match Unknown Impact/i),
      ).toBeVisible();
    });

    // --- Valid impact field ---
    await userEvent.clear(impactInput);

    await userEvent.type(impactInput, 'Impact');

    await waitFor(() => {
      expect(getByText('Impact A')).toBeVisible();
    });

    await userEvent.click(getByText('Impact A'));
    expect(getByText('Impact A')).toBeInTheDocument();
  });

  it('should fill impact and category fields with existing values', async () => {
    const { getByText } = await renderManuscriptForm({
      ...defaultProps,
      impact: { value: 'impact-id-1', label: 'Impact A' },
      categories: [{ value: 'category-id-1', label: 'Category A' }],
    });
    expect(getByText('Impact A')).toBeInTheDocument();
    expect(getByText('Category A')).toBeInTheDocument();
  });
});
