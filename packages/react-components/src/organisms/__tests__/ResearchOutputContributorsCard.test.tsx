import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router';
import { ReactElement } from 'react';
import { waitFor } from '@testing-library/dom';
import { createUserResponse } from '@asap-hub/fixtures';

import ResearchOutputContributorsCard, {
  AuthorRestriction,
  authorsDescription,
} from '../ResearchOutputContributorsCard';
import { renderWithResearchOutputForm } from '../test-utils/research-output-form';
import { ResearchOutputFormValues } from '../../utils';

const renderContributors = (
  ui: ReactElement,
  options?: { defaultValues?: Partial<ResearchOutputFormValues> },
) =>
  renderWithResearchOutputForm(
    <StaticRouter location="/">{ui}</StaticRouter>,
    options,
  );

const restrictedTo = (...memberIds: string[]): AuthorRestriction => ({
  kind: 'project-members',
  memberIds,
});

it('renders the contributors card form', async () => {
  const { getByText } = renderContributors(<ResearchOutputContributorsCard />);
  expect(getByText(/Who were the contributors/i)).toBeVisible();
});

describe('Authors Multiselect', () => {
  it('describes the teams requirement by default', () => {
    renderContributors(<ResearchOutputContributorsCard />);

    expect(screen.getByText(authorsDescription.default)).toBeVisible();
    expect(
      screen.queryByText(authorsDescription.projectMembersOnly),
    ).not.toBeInTheDocument();
  });

  it('describes the project membership requirement when authors are restricted to project members', () => {
    renderContributors(
      <ResearchOutputContributorsCard
        authorRestriction={restrictedTo('member-1')}
      />,
    );

    expect(
      screen.getByText(authorsDescription.projectMembersOnly),
    ).toBeVisible();
    expect(
      screen.queryByText(authorsDescription.default),
    ).not.toBeInTheDocument();
  });

  it('rejects authors who are not members of the project', async () => {
    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard
        authorRestriction={restrictedTo('member-1')}
      />,
      {
        defaultValues: {
          authors: [
            { label: 'Member One', value: 'member-1' },
            { label: 'Outsider', value: 'outsider-1' },
          ],
        },
      },
    );

    await act(async () => {
      await methodsRef.current?.trigger('authors');
    });

    const message = screen.getByText(/are not members of this project/i);
    expect(message).toBeVisible();
    expect(message.textContent).toContain('Outsider');
  });

  it('lists every author who is not a project member', async () => {
    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard
        authorRestriction={restrictedTo('member-1')}
      />,
      {
        defaultValues: {
          authors: [
            { label: 'Member One', value: 'member-1' },
            { label: 'Outsider One', value: 'outsider-1' },
            { label: 'Outsider Two', value: 'outsider-2' },
          ],
        },
      },
    );

    await act(async () => {
      await methodsRef.current?.trigger('authors');
    });

    const message = screen.getByText(/are not members of this project/i);
    expect(message.textContent).toContain('Outsider One');
    expect(message.textContent).toContain('Outsider Two');
    expect(message.textContent).not.toContain('Member One');
  });

  it('accepts authors when they are all members of the project', async () => {
    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard
        authorRestriction={restrictedTo('member-1', 'member-2')}
      />,
      {
        defaultValues: {
          authors: [
            { label: 'Member One', value: 'member-1' },
            { label: 'Member Two', value: 'member-2' },
          ],
        },
      },
    );

    await act(async () => {
      await methodsRef.current?.trigger('authors');
    });

    expect(
      screen.queryByText(/are not members of this project/i),
    ).not.toBeInTheDocument();
  });

  it('accepts any author when there is no restriction', async () => {
    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard authorRestriction={{ kind: 'none' }} />,
      {
        defaultValues: {
          authors: [{ label: 'Outsider', value: 'outsider-1' }],
        },
      },
    );

    await act(async () => {
      await methodsRef.current?.trigger('authors');
    });

    expect(
      screen.queryByText(/are not members of this project/i),
    ).not.toBeInTheDocument();
    expect(screen.getByText(authorsDescription.default)).toBeVisible();
  });

  it('updates authors form value', async () => {
    const getAuthorSuggestions = jest.fn();
    getAuthorSuggestions.mockResolvedValue([
      { author: createUserResponse(), label: 'Author Two', value: '2' },
      { author: createUserResponse(), label: 'Author One', value: '1' },
    ]);

    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard
        getAuthorSuggestions={getAuthorSuggestions}
      />,
    );

    await userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    await userEvent.click(screen.getByText('Author Two'));

    expect(methodsRef.current?.getValues('authors')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Author Two', value: '2' }),
      ]),
    );
  });
});

describe('Labs Multiselect', () => {
  it('should render provided values', () => {
    const { getByText } = renderContributors(
      <ResearchOutputContributorsCard />,
      {
        defaultValues: {
          labs: [
            { label: 'One Lab', value: '1' },
            { label: 'Two Lab', value: '2' },
          ],
        },
      },
    );
    expect(getByText(/one lab/i)).toBeVisible();
    expect(getByText(/two lab/i)).toBeVisible();
  });
  it('should be able to select from the list of options', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);
    const { getByText, getByLabelText, queryByText, methodsRef } =
      renderContributors(
        <ResearchOutputContributorsCard getLabSuggestions={loadOptions} />,
      );
    await userEvent.click(getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    await userEvent.click(getByText('One Lab'));
    expect(methodsRef.current?.getValues('labs')).toEqual([
      { label: 'One Lab', value: '1' },
    ]);
  });
  it('should render message when there is no match', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([]);
    const { getByLabelText, queryByText } = renderContributors(
      <ResearchOutputContributorsCard getLabSuggestions={loadOptions} />,
    );
    await userEvent.click(getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(queryByText(/no labs match/i)).toBeInTheDocument();
  });

  it('updates labs form value', async () => {
    const getLabSuggestions = jest.fn();
    getLabSuggestions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);

    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard getLabSuggestions={getLabSuggestions} />,
    );

    await userEvent.click(screen.getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    await userEvent.click(screen.getByText('One Lab'));

    expect(methodsRef.current?.getValues('labs')).toEqual([
      { label: 'One Lab', value: '1' },
    ]);
  });

  it('shows a required error when no labs are selected and clears it once a lab is added', async () => {
    const getLabSuggestions = jest.fn();
    getLabSuggestions.mockResolvedValue([{ label: 'One Lab', value: '1' }]);

    const { getByLabelText, queryByText, findByText } = renderContributors(
      <ResearchOutputContributorsCard getLabSuggestions={getLabSuggestions} />,
      { defaultValues: { labs: [] } },
    );

    const labsInput = getByLabelText(/Labs\(required\)/i);

    await userEvent.click(labsInput);
    await userEvent.keyboard('{Escape}');
    await userEvent.tab();

    expect(await findByText('Please add at least one lab.')).toBeVisible();

    await userEvent.click(labsInput);
    await userEvent.click(await findByText('One Lab'));

    await waitFor(() =>
      expect(
        queryByText('Please add at least one lab.'),
      ).not.toBeInTheDocument(),
    );
  });
});

describe('contributor team validation', () => {
  const authorWithTeams = (
    label: string,
    value: string,
    teamIds: string[],
  ) => ({
    label,
    value,
    author: {
      id: value,
      firstName: label,
      lastName: 'Author',
      displayName: label,
      teams: teamIds.map((id) => ({ id, role: 'Collaborating PI' })),
    },
  });

  it('flags an author whose teams are not listed as contributors', async () => {
    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard validateContributorTeams />,
      {
        defaultValues: {
          teams: [{ label: 'Team One', value: 'team-1' }],
          authors: [authorWithTeams('Author A', 'author-a', ['team-2'])],
        },
      },
    );

    await act(async () => {
      await methodsRef.current?.trigger('authors');
    });

    const message = screen.getByText(
      /do not have a team listed as a contributor/i,
    );
    expect(message).toBeVisible();
    expect(message.textContent).toContain('Author A');
  });

  it('accepts an author who has one of their teams listed', async () => {
    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard validateContributorTeams />,
      {
        defaultValues: {
          teams: [{ label: 'Team One', value: 'team-1' }],
          authors: [authorWithTeams('Author A', 'author-a', ['team-1'])],
        },
      },
    );

    await act(async () => {
      await methodsRef.current?.trigger('authors');
    });

    expect(
      screen.queryByText(/do not have a team listed as a contributor/i),
    ).not.toBeInTheDocument();
  });

  it('ignores authors with no teams (e.g. external authors)', async () => {
    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard validateContributorTeams />,
      {
        defaultValues: {
          teams: [{ label: 'Team One', value: 'team-1' }],
          authors: [{ label: 'External', value: 'external-1' }],
        },
      },
    );

    await act(async () => {
      await methodsRef.current?.trigger('authors');
    });

    expect(
      screen.queryByText(/do not have a team listed as a contributor/i),
    ).not.toBeInTheDocument();
  });

  it('does not validate author teams when the flag is off', async () => {
    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard />,
      {
        defaultValues: {
          teams: [{ label: 'Team One', value: 'team-1' }],
          authors: [authorWithTeams('Author A', 'author-a', ['team-2'])],
        },
      },
    );

    await act(async () => {
      await methodsRef.current?.trigger('authors');
    });

    expect(
      screen.queryByText(/do not have a team listed as a contributor/i),
    ).not.toBeInTheDocument();
  });

  it("flags a lab whose PI's team is not listed as a contributor", async () => {
    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard validateContributorTeams />,
      {
        defaultValues: {
          teams: [{ label: 'Team One', value: 'team-1' }],
          labs: [
            { label: 'Lab One', value: 'lab-1', labPITeamIds: ['team-2'] },
          ] as unknown as ResearchOutputFormValues['labs'],
        },
      },
    );

    await act(async () => {
      await methodsRef.current?.trigger('labs');
    });

    const message = screen.getByText(
      /do not list their corresponding PI’s team as a contributor/i,
    );
    expect(message).toBeVisible();
    expect(message.textContent).toContain('Lab One');
  });

  it("accepts a lab whose PI's team is listed as a contributor", async () => {
    const { methodsRef } = renderContributors(
      <ResearchOutputContributorsCard validateContributorTeams />,
      {
        defaultValues: {
          teams: [{ label: 'Team One', value: 'team-1' }],
          labs: [
            { label: 'Lab One', value: 'lab-1', labPITeamIds: ['team-1'] },
          ] as unknown as ResearchOutputFormValues['labs'],
        },
      },
    );

    await act(async () => {
      await methodsRef.current?.trigger('labs');
    });

    expect(
      screen.queryByText(
        /do not list their corresponding PI’s team as a contributor/i,
      ),
    ).not.toBeInTheDocument();
  });

  it('revalidates authors and labs when contributor teams change', async () => {
    const getTeamSuggestions = jest.fn();
    getTeamSuggestions.mockResolvedValue([
      { label: 'Team One', value: 'team-1' },
      { label: 'Team Two', value: 'team-2' },
    ]);

    const { methodsRef, getByLabelText, getByText, queryByText } =
      renderContributors(
        <ResearchOutputContributorsCard
          validateContributorTeams
          getTeamSuggestions={getTeamSuggestions}
        />,
        {
          defaultValues: {
            teams: [{ label: 'Team One', value: 'team-1' }],
            authors: [authorWithTeams('Author A', 'author-a', ['team-2'])],
            labs: [
              { label: 'Lab One', value: 'lab-1', labPITeamIds: ['team-2'] },
            ] as unknown as ResearchOutputFormValues['labs'],
          },
        },
      );

    await act(async () => {
      await methodsRef.current?.trigger(['authors', 'labs']);
    });

    expect(
      screen.getByText(/do not have a team listed as a contributor/i),
    ).toBeVisible();
    expect(
      screen.getByText(
        /do not list their corresponding PI’s team as a contributor/i,
      ),
    ).toBeVisible();

    await userEvent.click(getByLabelText(/teams\(required\)/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    await userEvent.click(getByText('Team Two'));

    await waitFor(() => {
      expect(
        queryByText(/do not have a team listed as a contributor/i),
      ).not.toBeInTheDocument();
      expect(
        queryByText(
          /do not list their corresponding PI’s team as a contributor/i,
        ),
      ).not.toBeInTheDocument();
    });
  });
});

describe('Teams Multiselect', () => {
  it('should render provided values', () => {
    const { getByText } = renderContributors(
      <ResearchOutputContributorsCard />,
      {
        defaultValues: {
          teams: [
            { label: 'Team One', value: '1' },
            { label: 'Team Two', value: '2' },
          ],
        },
      },
    );
    expect(getByText(/team one/i)).toBeVisible();
    expect(getByText(/team two/i)).toBeVisible();
  });
  it('should be able to select from the list of options', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([
      { label: 'Team One', value: '1' },
      { label: 'Team Two', value: '2' },
    ]);

    const { getByText, getByLabelText, queryByText, methodsRef } =
      renderContributors(
        <ResearchOutputContributorsCard getTeamSuggestions={loadOptions} />,
      );
    await userEvent.click(getByLabelText(/teams\(required\)/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    await userEvent.click(getByText('Team One'));
    expect(methodsRef.current?.getValues('teams')).toEqual([
      { label: 'Team One', value: '1' },
    ]);
  });
  it('should render message when there is no match', async () => {
    const loadOptions = jest.fn();
    loadOptions.mockResolvedValue([]);
    const { getByLabelText, queryByText } = renderContributors(
      <ResearchOutputContributorsCard getTeamSuggestions={loadOptions} />,
    );
    await userEvent.click(getByLabelText(/Teams\(required\)/i));
    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    expect(queryByText(/no teams match/i)).toBeInTheDocument();
  });
});
