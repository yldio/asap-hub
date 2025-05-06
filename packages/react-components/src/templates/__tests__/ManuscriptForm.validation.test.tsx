import { render, screen, waitFor } from '@testing-library/react';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
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
};

describe('ManuscriptForm team validation', () => {
  it('displays error message when labPI team is not among selected teams and hide it when team is selected', async () => {
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          getTeamSuggestions={getTeamSuggestionsMock}
          getLabSuggestions={getLabSuggestionsMock}
        />
      </StaticRouter>,
    );

    userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
    await waitFor(() => {
      expect(screen.getByText('Lab One')).toBeVisible();
    });
    userEvent.click(screen.getByText('Lab One'));
    userEvent.tab();

    // Error message for the team input
    expect(
      screen.getByText(
        /The following lab\(s\) do not have the correspondent PI\'s team listed as contributors\. At least one of the teams the PI belongs to must be added./,
      ),
    ).toBeVisible();

    // Error message for the lab input
    expect(
      screen.getByText(
        /The following lab\(s\) do not have the correspondent PI's team listed as a contributor. At least one of the teams they belong to must be added to the teams section above./,
      ),
    ).toBeVisible();

    expect(screen.getAllByText(/•.*Lab One/i).length).toBe(2);

    userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeVisible();
    });
    userEvent.click(screen.getByText('Team A'));
    userEvent.tab();

    expect(
      screen.queryByText(
        /The following lab\(s\) do not have the correspondent PI\'s team listed as contributors\. At least one of the teams the PI belongs to must be added./,
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
        <StaticRouter>
          <ManuscriptForm
            {...defaultProps}
            getTeamSuggestions={getTeamSuggestionsMock}
            getLabSuggestions={getLabSuggestionsMock}
            getAuthorSuggestions={getAuthorSuggestionsMock}
          />
        </StaticRouter>,
      );

      userEvent.click(screen.getByLabelText(label));
      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
      );

      userEvent.click(screen.getByText('Author A'));
      userEvent.tab();

      // Error message for the team input
      expect(
        screen.getByText(
          /The following contributor\(s\) do not have a team listed above/i,
        ),
      ).toBeVisible();

      // Error message for the author input
      expect(screen.getByText(errorMessage)).toBeVisible();

      expect(screen.getAllByText(/•.*Author A/i).length).toBe(2);

      userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
      await waitFor(() => {
        expect(screen.getByText('Team A')).toBeVisible();
      });
      userEvent.click(screen.getByText('Team A'));
      userEvent.tab();

      expect(
        screen.queryByText(
          /The following contributor\(s\) do not have a team listed above/i,
        ),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
      expect(screen.queryByText(/•.*Author A/i)).not.toBeInTheDocument();
    },
  );

  it('when there are missing teams for both lab and author, the error is displayed and hidden accordingly', async () => {
    const { container } = render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          getTeamSuggestions={getTeamSuggestionsMock}
          getLabSuggestions={getLabSuggestionsMock}
          getAuthorSuggestions={getAuthorSuggestionsMock}
        />
      </StaticRouter>,
    );

    userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
    await waitFor(() => {
      expect(screen.getByText('Lab One')).toBeVisible();
    });
    userEvent.click(screen.getByText('Lab One'));
    userEvent.tab();

    userEvent.click(screen.getByLabelText(/First Author/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    userEvent.click(screen.getByText('Author B'));
    userEvent.tab();

    const firstAuthorErrorMessage =
      'The following first author(s) do not have a team listed as a contributor. At least one of the teams they belong to must be added to the teams section above. • Author B';

    const labErrorMessage =
      "The following lab(s) do not have the correspondent PI's team listed as a contributor. At least one of the teams they belong to must be added to the teams section above. • Lab One";

    expect(container).toHaveTextContent(
      "The following contributor(s) do not have a team listed above. At least one of the teams they belong to must be added. • Author B The following lab(s) do not have the correspondent PI's team listed as contributors. At least one of the teams the PI belongs to must be added. • Lab One",
    );

    expect(container).toHaveTextContent(firstAuthorErrorMessage);

    expect(container).toHaveTextContent(labErrorMessage);

    userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
    await waitFor(() => {
      expect(screen.getByText('Team B')).toBeVisible();
    });
    userEvent.click(screen.getByText('Team B'));
    userEvent.tab();

    expect(container).toHaveTextContent(
      "The following lab(s) do not have the correspondent PI's team listed as contributors. At least one of the teams the PI belongs to must be added. • Lab One",
    );

    expect(container).not.toHaveTextContent(firstAuthorErrorMessage);

    expect(container).toHaveTextContent(labErrorMessage);

    userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeVisible();
    });
    userEvent.click(screen.getByText('Team A'));
    userEvent.tab();

    expect(container).not.toHaveTextContent(firstAuthorErrorMessage);

    expect(container).not.toHaveTextContent(labErrorMessage);
  });
});
