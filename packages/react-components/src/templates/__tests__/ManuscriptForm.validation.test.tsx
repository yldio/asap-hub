import { mockActWarningsInConsole } from '@asap-hub/dom-test-utils';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { ComponentProps, Suspense } from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { MemoryRouter } from 'react-router-dom';
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
  firstAuthors: [],
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

describe('ManuscriptForm team validation', () => {
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
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
    await waitFor(() => {
      expect(screen.getByText('Lab One')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Lab One'));
    await userEvent.tab();

    // Error message for the team input
    expect(
      screen.getByText(
        /The following lab\(s\) do not have the correspondent PI's team listed as contributors\. At least one of the teams the PI belongs to must be added./,
      ),
    ).toBeVisible();

    // Error message for the lab input
    expect(
      screen.getByText(
        /The following lab\(s\) do not have the correspondent PI's team listed as a contributor. At least one of the teams they belong to must be added to the teams section above./,
      ),
    ).toBeVisible();

    expect(screen.getAllByText(/•.*Lab One/i).length).toBe(2);

    await userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Team A'));
    await userEvent.tab();

    expect(
      screen.queryByText(
        /The following lab\(s\) do not have the correspondent PI's team listed as contributors\. At least one of the teams the PI belongs to must be added./,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /The following lab\(s\) do not have the correspondent PI's team listed as a contributor. At least one of the teams they belong to must be added to the teams section above./,
      ),
    ).not.toBeInTheDocument();

    expect(screen.queryByText(/•.*Lab One/i)).not.toBeInTheDocument();
  });

  it.each`
    authorType                | label                     | errorMessage
    ${'first author'}         | ${/First Author/}         | ${/The following first author\(s\) do not have a team listed as a contributor/i}
    ${'corresponding author'} | ${/Corresponding Author/} | ${/The following corresponding author\(s\) do not have a team listed as a contributor/i}
    ${'additional author'}    | ${/Additional Author/}    | ${/The following additional author\(s\) do not have a team listed as a contributor/i}
  `(
    'displays error message when $authorType team is not among selected teams and hide it when team is selected',
    async ({ label, errorMessage }) => {
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
        expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      });

      await userEvent.click(screen.getByLabelText(label));
      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
      );

      await userEvent.click(screen.getByText('Author A'));
      await userEvent.tab();

      // Error message for the team input
      expect(
        screen.getByText(
          /The following contributor\(s\) do not have a team listed above/i,
        ),
      ).toBeVisible();

      // Error message for the author input
      expect(screen.getByText(errorMessage)).toBeVisible();

      expect(screen.getAllByText(/•.*Author A/i).length).toBe(2);

      await userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
      await waitFor(() => {
        expect(screen.getByText('Team A')).toBeVisible();
      });
      await userEvent.click(screen.getByText('Team A'));
      await userEvent.tab();

      expect(
        screen.queryByText(
          /The following contributor\(s\) do not have a team listed above/i,
        ),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
      expect(screen.queryByText(/•.*Author A/i)).not.toBeInTheDocument();
    },
  );

  it.each`
    authorType                | label
    ${'first author'}         | ${/First Author/}
    ${'corresponding author'} | ${/Corresponding Author/}
    ${'additional author'}    | ${/Additional Author/}
  `(
    'do not display error message when $authorType does not have a team',

    async ({ label }) => {
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
        expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      });

      await userEvent.click(screen.getByLabelText(label));
      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
      );

      await userEvent.click(screen.getByText('Author A'));
      await userEvent.tab();

      expect(
        screen.queryByText(
          /The following contributor\(s\) do not have a team listed above/i,
        ),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/do not have a team listed as a contributor/i),
      ).not.toBeInTheDocument();
    },
  );

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
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
    await waitFor(() => {
      expect(screen.getByText('Lab One')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Lab One'));
    await userEvent.tab();

    await userEvent.click(screen.getByLabelText(/First Author/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText('Author B'));
    await userEvent.tab();

    const firstAuthorErrorMessage =
      'The following first author(s) do not have a team listed as a contributor. At least one of the teams they belong to must be added to the teams section above. • Author B';

    const labErrorMessage =
      "The following lab(s) do not have the correspondent PI's team listed as a contributor. At least one of the teams they belong to must be added to the teams section above. • Lab One";

    expect(container).toHaveTextContent(
      "The following contributor(s) do not have a team listed above. At least one of the teams they belong to must be added. • Author B The following lab(s) do not have the correspondent PI's team listed as contributors. At least one of the teams the PI belongs to must be added. • Lab One",
    );

    expect(container).toHaveTextContent(firstAuthorErrorMessage);

    expect(container).toHaveTextContent(labErrorMessage);

    await userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
    await waitFor(() => {
      expect(screen.getByText('Team B')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Team B'));
    await userEvent.tab();

    expect(container).toHaveTextContent(
      "The following lab(s) do not have the correspondent PI's team listed as a contributor. At least one of the teams they belong to must be added to the teams section above. • Lab One",
    );

    expect(container).not.toHaveTextContent(firstAuthorErrorMessage);

    expect(container).toHaveTextContent(labErrorMessage);

    await userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Team A'));
    await userEvent.tab();

    expect(container).not.toHaveTextContent(firstAuthorErrorMessage);

    expect(container).not.toHaveTextContent(labErrorMessage);

    consoleErrorSpy.mockRestore();
  });

  it('when two authors without team selected and a lab without team selected are added, when one of the authors is removed, the authors error still flags the remainingauthor', async () => {
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
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText(/First Author/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText('Author A'));
    await userEvent.tab();

    await userEvent.click(screen.getByLabelText(/First Author/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText('Author B'));
    await userEvent.tab();

    await userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
    await waitFor(() => {
      expect(screen.getByText('Lab One')).toBeVisible();
    });
    await userEvent.click(screen.getByText('Lab One'));
    await userEvent.tab();

    expect(container).toHaveTextContent(
      "The following contributor(s) do not have a team listed above. At least one of the teams they belong to must be added. • Author A • Author B The following lab(s) do not have the correspondent PI's team listed as contributors. At least one of the teams the PI belongs to must be added. • Lab One",
    );

    expect(container).toHaveTextContent(
      'The following first author(s) do not have a team listed as a contributor. At least one of the teams they belong to must be added to the teams section above. • Author A • Author B',
    );

    expect(container).toHaveTextContent(
      "The following lab(s) do not have the correspondent PI's team listed as a contributor. At least one of the teams they belong to must be added to the teams section above. • Lab One",
    );

    await userEvent.click(screen.getByLabelText('Remove Author A'));
    await userEvent.tab();

    expect(container).toHaveTextContent(
      'The following first author(s) do not have a team listed as a contributor. At least one of the teams they belong to must be added to the teams section above. • Author B',
    );

    expect(container).not.toHaveTextContent(
      'Please select at least one author.',
    );
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
        expect(container.queryByText(/Loading.../i)).not.toBeInTheDocument();
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
        expect(container.queryByText(/Loading.../i)).not.toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole('textbox', {
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
