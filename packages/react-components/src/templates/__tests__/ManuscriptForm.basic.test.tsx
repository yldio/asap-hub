import { AuthorResponse, AuthorSelectOption } from '@asap-hub/model';
import type {
  ByRoleMatcher,
  ByRoleOptions,
  waitForOptions,
} from '@testing-library/react';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { createMemoryHistory, History } from 'history';
import { ComponentProps } from 'react';
import { MemoryRouter, Route, Router, StaticRouter } from 'react-router-dom';
import ManuscriptForm from '../ManuscriptForm';

type FindByRole = (
  role: ByRoleMatcher,
  options?: ByRoleOptions | undefined,
  waitForElementOptions?: waitForOptions | undefined,
) => Promise<HTMLElement>;

jest.mock(
  'react-lottie',
  () =>
    function MockLottie() {
      return <div>Loading...</div>;
    },
);

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

describe('Manuscript form', () => {
  beforeEach(() => {
    cleanup();
    jest.spyOn(console, 'error').mockImplementation();
    history = createMemoryHistory();
  });

  it('renders the form', async () => {
    const { getByRole } = render(
      <StaticRouter>
        <ManuscriptForm {...defaultProps} />
      </StaticRouter>,
    );
    expect(
      getByRole('heading', { name: /What are you sharing/i }),
    ).toBeVisible();
    expect(getByRole('button', { name: /Submit/ })).toBeVisible();
  });

  it('data is sent on form submission', async () => {
    const { findByRole } = render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Draft Manuscript (prior to Publication)"
          manuscriptFile={{
            id: '123',
            filename: 'test.pdf',
            url: 'http://example.com/test.pdf',
          }}
          keyResourceTable={{
            id: '124',
            filename: 'test.csv',
            url: 'http://example.com/test.csv',
          }}
        />
      </StaticRouter>,
    );

    await submitForm({ findByRole });

    await waitFor(() => {
      expect(defaultProps.onCreate).toHaveBeenCalledWith({
        title: 'manuscript title',
        eligibilityReasons: [],
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
    const { getByRole, getAllByText, queryByText } = render(
      <StaticRouter>
        <ManuscriptForm {...defaultProps} />
      </StaticRouter>,
    );

    const input = getByRole('textbox', { name: /Title of Manuscript/i });
    userEvent.type(input, '');
    input.focus();
    input.blur();
    await waitFor(() => {
      expect(
        getAllByText(/Please enter a title/i).length,
      ).toBeGreaterThanOrEqual(1);
    });

    userEvent.type(input, 'title');
    input.blur();

    await waitFor(() => {
      expect(queryByText(/Please enter a title/i)).toBeNull();
    });
  });

  it('displays error message when manuscript title is not unique', async () => {
    const onUpdate = jest.fn().mockRejectedValueOnce({
      statusCode: 422,
      response: {
        message: 'Title must be unique',
        data: { team: 'ASAP', manuscriptId: 'SC1-000129-005-org-G-1' },
      },
    });

    const renderResult = render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Draft Manuscript (prior to Publication)"
          manuscriptFile={{
            id: '123',
            filename: 'test.pdf',
            url: 'http://example.com/test.pdf',
          }}
          keyResourceTable={{
            id: '124',
            filename: 'test.csv',
            url: 'http://example.com/test.csv',
          }}
          manuscriptId="manuscript-id"
          onUpdate={onUpdate}
        />
      </StaticRouter>,
    );

    await submitForm(renderResult);

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });

    const { container } = renderResult;
    await waitFor(() => {
      expect(container).toHaveTextContent(
        'A manuscript with this title has already been submitted for Team ASAP (SC1-000129-005-org-G-1). Please use the edit or resubmission button to update this manuscript.',
      );
    });
  });

  it('displays error message when manuscript title and details exceed 256 characters', async () => {
    const { getByRole, findByText } = render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          type="Original Research"
          lifecycle="Other"
        />
      </StaticRouter>,
    );

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
    const { getByRole, getByText } = render(
      <StaticRouter>
        <ManuscriptForm {...defaultProps} />
      </StaticRouter>,
    );

    const textbox = getByRole('textbox', {
      name: /Type of Manuscript/i,
    });
    userEvent.type(textbox, 'invalid type');

    expect(getByText(/Sorry, no types match/i)).toBeVisible();
  });

  it('triggers validation when typing into Preprint DOI field', async () => {
    const { getByRole } = render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Preprint"
        />
      </StaticRouter>,
    );

    const preprintInput = getByRole('textbox', {
      name: /Preprint DOI/i,
    });

    await userEvent.type(preprintInput, '10.1234/test');
    preprintInput.blur();

    expect(preprintInput).toHaveValue('10.1234/test');
  });

  it('resets form fields to default values when no longer visible', async () => {
    const { getByRole, queryByRole } = render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
          manuscriptFile={{
            id: '123',
            url: 'https://test-url',
            filename: 'abc.jpeg',
          }}
          keyResourceTable={{
            id: '124',
            url: 'https://test-url',
            filename: 'abc.jpeg',
          }}
        />
      </StaticRouter>,
    );

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
    const { getByRole } = render(
      <StaticRouter>
        <ManuscriptForm {...defaultProps} />
      </StaticRouter>,
    );

    const submitButton = getByRole('button', { name: /Submit/ });

    expect(submitButton).not.toBeEnabled();
  });

  it('should go back when cancel button is clicked', async () => {
    const { findByText, getByRole } = render(
      <MemoryRouter>
        <Router history={history}>
          <Route path="/form">
            <ManuscriptForm {...defaultProps} />
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
});
