import { mockActWarningsInConsole } from '@asap-hub/dom-test-utils';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { ComponentProps, Suspense } from 'react';
import { StaticRouter, MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import ManuscriptForm from '../ManuscriptForm';

jest.mock(
  'react-lottie',
  () =>
    function MockLottie() {
      return <div>Loading...</div>;
    },
);

jest.setTimeout(30_000);

const teamId = '1';

const getTeamSuggestionsMock = jest.fn().mockResolvedValue([
  { label: 'Team A', value: 'team-a' },
  { label: 'Team B', value: 'team-b' },
]);

const getImpactSuggestionsMock = jest.fn().mockResolvedValue([
  { name: 'Impact A', id: 'impact-id-1' },
  { name: 'Impact B', id: 'impact-id-2' },
]);

const getCategorySuggestionsMock = jest.fn().mockResolvedValue([
  { name: 'Category A', id: 'category-id-1' },
  { name: 'Category B', id: 'category-id-2' },
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
  authors: [],
  onError: jest.fn(),
  clearFormToast: jest.fn(),
  isOpenScienceTeamMember: false,
  impact: { value: 'impact-id-1', label: 'Impact A' },
  categories: [{ value: 'category-id-1', label: 'Category A' }],
  getImpactSuggestions: getImpactSuggestionsMock,
  getCategorySuggestions: getCategorySuggestionsMock,
};

describe('ManuscriptForm team validation', () => {
  const authorsErrorRegex =
    /The following author\(s\) do not have a team listed as a contributor\. Add at least one of their teams, or contact support if they don’t belong to any\./;
  const labsErrorRegex =
    /The following lab\(s\) do not list their corresponding PI’s team as a contributor\. Please add at least one of their teams to the Teams field\./;

  const authorsErrorMessage =
    'The following author(s) do not have a team listed as a contributor. Add at least one of their teams, or contact support if they don’t belong to any.';
  const labsErrorMessage =
    'The following lab(s) do not list their corresponding PI’s team as a contributor. Please add at least one of their teams to the Teams field.';

  it('displays error message when labPI team is not among selected teams and hide it when team is selected', async () => {
    render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            getTeamSuggestions={getTeamSuggestionsMock}
            getLabSuggestions={getLabSuggestionsMock}
          />
        </Suspense>
      </StaticRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('combobox', { name: /Labs/i }));
    await waitFor(() => {
      expect(screen.getByText('Lab One')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Lab One'));
    await userEvent.tab();

    // Error message for the lab input
    expect(screen.getByText(labsErrorRegex)).toBeVisible();

    expect(screen.getAllByText(/•.*Lab One/i).length).toBe(1);

    await userEvent.click(screen.getByRole('combobox', { name: /Teams/i }));
    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Team A'));
    await userEvent.tab();

    expect(screen.queryByText(labsErrorRegex)).not.toBeInTheDocument();

    expect(screen.queryByText(/•.*Lab One/i)).not.toBeInTheDocument();
  });

  it('displays error message when authors team is not among selected teams and hide it when team is selected', async () => {
    render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            getTeamSuggestions={getTeamSuggestionsMock}
            getLabSuggestions={getLabSuggestionsMock}
            getAuthorSuggestions={getAuthorSuggestionsMock}
          />
        </Suspense>
      </StaticRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText(/Authors/));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText('Author A'));
    await userEvent.tab();

    // Error message for the author input
    expect(screen.getByText(authorsErrorRegex)).toBeVisible();

    expect(screen.getAllByText(/•.*Author A/i).length).toBe(1);

    await userEvent.click(screen.getByRole('combobox', { name: /Teams/i }));
    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Team A'));
    await userEvent.tab();

    expect(screen.queryByText(authorsErrorRegex)).not.toBeInTheDocument();
    expect(screen.queryByText(/•.*Author A/i)).not.toBeInTheDocument();
  });

  it('does not display error message when author does not have a team', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    const getAuthorSuggestionsWithoutTeamMock = jest.fn().mockResolvedValue([
      {
        label: 'Author A',
        value: 'author-a',
        id: 'author-a',
        displayName: 'Author A',
        author: {
          firstName: 'Author',
          lastName: 'A',
          teams: [],
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
          teams: [],
          __meta: {
            type: 'user',
          },
        },
      },
    ]);

    render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            getTeamSuggestions={getTeamSuggestionsMock}
            getLabSuggestions={getLabSuggestionsMock}
            getAuthorSuggestions={getAuthorSuggestionsWithoutTeamMock}
          />
        </Suspense>
      </StaticRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText(/Authors/));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText('Author A'));
    await userEvent.tab();

    expect(
      screen.queryByText(/do not have a team listed as a contributor/i),
    ).not.toBeInTheDocument();
  });

  it('when there are missing teams for both lab and author, the error is displayed and hidden accordingly', async () => {
    const consoleErrorSpy = mockActWarningsInConsole('error');
    const { container } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            getTeamSuggestions={getTeamSuggestionsMock}
            getLabSuggestions={getLabSuggestionsMock}
            getAuthorSuggestions={getAuthorSuggestionsMock}
          />
        </Suspense>
      </StaticRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('combobox', { name: /Labs/i }));
    await waitFor(() => {
      expect(screen.getByText('Lab One')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Lab One'));
    await userEvent.tab();

    await userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText('Author B'));
    await userEvent.tab();

    expect(container).toHaveTextContent(`${authorsErrorMessage} • Author B`);

    expect(container).toHaveTextContent(`${labsErrorMessage} • Lab One`);

    await userEvent.click(screen.getByRole('combobox', { name: /Teams/i }));
    await waitFor(() => {
      expect(screen.getByText('Team B')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Team B'));
    await userEvent.tab();

    expect(container).not.toHaveTextContent(
      `${authorsErrorMessage} • Author B`,
    );

    expect(container).toHaveTextContent(`${labsErrorMessage} • Lab One`);

    await userEvent.click(screen.getByRole('combobox', { name: /Teams/i }));
    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Team A'));
    await userEvent.tab();

    expect(container).not.toHaveTextContent(
      `${authorsErrorMessage} • Author B`,
    );

    expect(container).not.toHaveTextContent(`${labsErrorMessage} • Lab One`);

    consoleErrorSpy.mockRestore();
  });

  it('when two authors without team selected and a lab without team selected are added, when one of the authors is removed, the authors error still flags the remaining author', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    const getLabWithUniqueTeamSuggestionsMock = jest
      .fn()
      .mockResolvedValue([
        { label: 'Lab One', value: 'lab-1', labPITeamIds: ['team-lab'] },
      ]);

    const { container } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            getTeamSuggestions={getTeamSuggestionsMock}
            getLabSuggestions={getLabWithUniqueTeamSuggestionsMock}
            getAuthorSuggestions={getAuthorSuggestionsMock}
          />
        </Suspense>
      </StaticRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText('Author A'));
    await userEvent.tab();

    await userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText('Author B'));
    await userEvent.tab();

    await userEvent.click(screen.getByRole('combobox', { name: /Labs/i }));
    await waitFor(() => {
      expect(screen.getByText('Lab One')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Lab One'));
    await userEvent.tab();

    expect(container).toHaveTextContent(
      `${authorsErrorMessage} • Author A • Author B`,
    );

    expect(container).toHaveTextContent(
      'The following lab(s) do not list their corresponding PI’s team as a contributor. Please add at least one of their teams to the Teams field. • Lab One',
    );

    await userEvent.click(screen.getAllByLabelText('Remove Author A')[0]!);
    await userEvent.tab();

    expect(container).toHaveTextContent(`${authorsErrorMessage} • Author B`);

    expect(container).not.toHaveTextContent('Please add at least one author.');
  });
});

describe('ManuscriptForm URL Requirement', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
    cleanup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each`
    lifecycle                                     | label
    ${'Preprint'}                                 | ${'URL (required)'}
    ${'Publication'}                              | ${'URL (required)'}
    ${'Publication with addendum or corrigendum'} | ${'URL (required)'}
    ${'Draft Manuscript (prior to Publication)'}  | ${'URL (optional)'}
    ${'Other'}                                    | ${'URL (optional)'}
    ${'Typeset proof'}                            | ${'URL (optional)'}
  `(
    'should set URL as $label for $lifecycle lifecycle - last',
    async ({ lifecycle, label }) => {
      const container = render(
        <MemoryRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <ManuscriptForm {...defaultProps} lifecycle={lifecycle} />
          </Suspense>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(container.queryByText(/loading/i)).not.toBeInTheDocument();
        expect(
          container.getByRole('textbox', { name: label, hidden: true }),
        ).toBeInTheDocument();
      });
    },
  );

  it.each`
    lifecycle                                     | label
    ${'Preprint'}                                 | ${'URL (required)'}
    ${'Publication'}                              | ${'URL (required)'}
    ${'Publication with addendum or corrigendum'} | ${'URL (required)'}
    ${'Draft Manuscript (prior to Publication)'}  | ${'URL (optional)'}
    ${'Other'}                                    | ${'URL (optional)'}
    ${'Typeset proof'}                            | ${'URL (optional)'}
  `(
    'should set URL as $label when selecting $lifecycle lifecycle',
    async ({ lifecycle, label }) => {
      const container = render(
        <MemoryRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <ManuscriptForm
              {...defaultProps}
              type="Original Research"
              lifecycle={undefined}
            />
          </Suspense>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(container.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole('combobox', {
          name: /Where is the manuscript in the life cycle/i,
        }),
      );
      await userEvent.click(screen.getByText(lifecycle));
      await userEvent.tab();

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', { name: label }),
        ).toBeInTheDocument();
      });
    },
  );
});
