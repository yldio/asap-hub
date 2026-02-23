import { AuthorResponse, AuthorSelectOption } from '@asap-hub/model';
import {
  render,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, Suspense } from 'react';
import { StaticRouter } from 'react-router';
import ManuscriptForm from '../ManuscriptForm';

jest.setTimeout(30_000);

const teamId = '1';

const getTeamSuggestionsMock = jest.fn().mockResolvedValue([
  { label: 'Team A', value: 'team-a' },
  { label: 'Team B', value: 'team-b' },
]);

const getLabSuggestionsMock = jest
  .fn()
  .mockResolvedValue([
    { label: 'Lab One', value: 'lab-1', labPITeamIds: ['team-a'] },
  ]);

const getAuthorSuggestionsMock = jest.fn().mockResolvedValue([
  {
    label: 'Author A',
    value: 'author-a',
    id: 'author-a',
    displayName: 'Author A',
    author: {
      firstName: 'Author',
      lastName: 'A',
      teams: [{ id: 'team-a', name: 'Team A' }],
      __meta: {
        type: 'user',
      },
    },
  },
  {
    label: 'Author B',
    value: 'author-b',
    id: 'author-b',
    displayName: 'Author B',
    author: {
      firstName: 'Author',
      lastName: 'B',
      teams: [{ id: 'team-b', name: 'Team B' }],
      __meta: {
        type: 'user',
      },
    },
  },
]);

const getImpactSuggestionsMock = jest.fn().mockResolvedValue([
  { label: 'Impact A', value: 'impact-id-1' },
  { label: 'Impact B', value: 'impact-id-2' },
]);

const getCategorySuggestionsMock = jest.fn().mockResolvedValue([
  { label: 'Category A', value: 'category-id-1' },
  { label: 'Category B', value: 'category-id-2' },
]);

const defaultProps: ComponentProps<typeof ManuscriptForm> = {
  getShortDescriptionFromDescription: jest.fn(),
  onCreate: jest.fn(() => Promise.resolve()),
  onUpdate: jest.fn(() => Promise.resolve()),
  onResubmit: jest.fn(() => Promise.resolve()),
  getAuthorSuggestions: getAuthorSuggestionsMock,
  getLabSuggestions: getLabSuggestionsMock,
  getTeamSuggestions: getTeamSuggestionsMock,
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
  shortDescription: 'Some short description',
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
  onInvalid: jest.fn(),
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
});

it('displays error message when manuscript title is not unique', async () => {
  const onUpdate = jest.fn().mockRejectedValueOnce({
    statusCode: 422,
    response: {
      message: 'Title must be unique',
      data: { team: 'ASAP', manuscriptId: 'SC1-000129-005-org-G-1' },
    },
  });

  const { container, findByRole } = render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Test Loading...</div>}>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          url="https://example.com"
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
      </Suspense>
    </StaticRouter>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/Test Loading.../i));

  const submitBtn = await findByRole('button', { name: /Submit/ });
  await userEvent.click(submitBtn);

  expect(defaultProps.onInvalid).not.toHaveBeenCalled();

  await waitFor(() => {
    const confirmBtn = screen.getByRole('button', {
      name: /Submit Manuscript/i,
    });
    expect(confirmBtn).toBeInTheDocument();
  });

  await userEvent.click(
    screen.getByRole('button', {
      name: /Submit Manuscript/i,
    }),
  );

  await waitFor(() => {
    expect(container).toHaveTextContent(
      'A manuscript with this title has already been submitted for Team ASAP (SC1-000129-005-org-G-1). Please use the edit or resubmission button to update this manuscript.',
    );
  });
});

it('calls onInvalid callback and scrolls to top when form validation fails', async () => {
  const onInvalid = jest.fn();
  const scrollToMock = jest.fn();
  const originalScrollTo = window.scrollTo;
  window.scrollTo = scrollToMock;

  render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Test Loading...</div>}>
        <ManuscriptForm
          {...defaultProps}
          title="" // Empty title will trigger validation error
          onInvalid={onInvalid}
        />
      </Suspense>
    </StaticRouter>,
  );

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Submit/ })).toBeInTheDocument();
  });

  const submitBtn = screen.getByRole('button', { name: /Submit/ });
  await userEvent.click(submitBtn);

  await waitFor(() => {
    expect(onInvalid).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  // Cleanup
  window.scrollTo = originalScrollTo;
});

it('scrolls to top of scrollable container when form validation fails inside a main element', async () => {
  const onInvalid = jest.fn();
  const scrollToMock = jest.fn();

  render(
    <StaticRouter location="/">
      <main data-testid="outer-main">
        <Suspense fallback={<div>Test Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="" // Empty title will trigger validation error
            onInvalid={onInvalid}
          />
        </Suspense>
      </main>
    </StaticRouter>,
  );

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Submit/ })).toBeInTheDocument();
  });

  // Mock the scrollTo method on the outer main element
  const mainElement = screen.getByTestId('outer-main');
  mainElement.scrollTo = scrollToMock;

  const submitBtn = screen.getByRole('button', { name: /Submit/ });
  await userEvent.click(submitBtn);

  await waitFor(() => {
    expect(onInvalid).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
