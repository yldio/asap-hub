import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router';

import EditEventAttendanceModal from '../EditEventAttendanceModal';
import { EventAttendanceTeam } from '../EventAttendance';

const teams: EventAttendanceTeam[] = [
  {
    teamId: 't1',
    teamName: 'Team Alpha',
    attended: true,
    teamType: 'Discovery Team',
  },
  {
    teamId: 't2',
    teamName: 'Team Beta',
    attended: false,
    teamType: 'Resource Team',
  },
];

const loadSearchOptions = jest.fn(async () => [
  {
    value: 'searched-1',
    label: 'Searched Team',
    optionType: 'team' as const,
    teamType: 'Discovery Team' as const,
  },
  {
    value: 'searched-group-1',
    label: 'Searched Group',
    optionType: 'interestGroup' as const,
    teams: [{ teamId: 'sgt-1', teamName: 'Group Search Team', attended: true }],
  },
]);

const onSelectInterestGroup = jest.fn(async (interestGroupId: string) => {
  if (interestGroupId === 'ig2') {
    return [
      { teamId: 'shared', teamName: 'Shared Team', attended: true },
      { teamId: 'only2', teamName: 'Only Two', attended: true },
    ];
  }
  if (interestGroupId === 'ig3') {
    return [
      { teamId: 'shared', teamName: 'Shared Team', attended: true },
      { teamId: 'only3', teamName: 'Only Three', attended: true },
    ];
  }
  return [
    {
      teamId: 'ig-team-1',
      teamName: 'Group Team',
      attended: true,
      teamType: 'Discovery Team' as const,
    },
  ];
});

const onUploadList = jest.fn(async () => [
  { teamId: 'uploaded-1', teamName: 'Uploaded Team', attended: true },
]);

const onSave = jest.fn();
const onDismiss = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

const renderModal = (
  overrides: Partial<ComponentProps<typeof EditEventAttendanceModal>> = {},
) =>
  render(
    <StaticRouter location="/">
      <EditEventAttendanceModal
        loadSearchOptions={loadSearchOptions}
        onSelectInterestGroup={onSelectInterestGroup}
        onUploadList={onUploadList}
        onSave={onSave}
        onDismiss={onDismiss}
        interestGroups={[{ id: 'ig1', name: 'Alpha Group' }]}
        teams={teams}
        {...overrides}
      />
    </StaticRouter>,
  );

describe('EditEventAttendanceModal', () => {
  it('Should render the "Add Attendance" title and empty prompt with no attendees', () => {
    renderModal({ teams: [] });

    expect(
      screen.getByRole('heading', { name: 'Add Attendance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Add teams to track attendance'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: 'Mark All Attended' }),
    ).not.toBeInTheDocument();
  });

  it('Should render the "Edit Attendance" title, rows and counts when attendees exist', () => {
    renderModal();

    expect(
      screen.getByRole('heading', { name: 'Edit Attendance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Team Alpha' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Team Beta' })).toBeInTheDocument();
    expect(screen.getByText('2 Expected')).toBeInTheDocument();
    expect(screen.getByText('1 Attended')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('Should toggle a team attendance on and off', async () => {
    renderModal();

    const betaSwitch = screen.getByRole('checkbox', {
      name: 'Team Beta attendance',
    });
    expect(betaSwitch).not.toBeChecked();

    await userEvent.click(betaSwitch);

    expect(betaSwitch).toBeChecked();
    expect(screen.getByText('2 Attended')).toBeInTheDocument();
  });

  it('Should mark all teams as attended', async () => {
    renderModal();

    await userEvent.click(
      screen.getByRole('button', { name: 'Mark All Attended' }),
    );

    expect(
      screen.getByRole('checkbox', { name: 'Team Alpha attendance' }),
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Team Beta attendance' }),
    ).toBeChecked();
    expect(screen.getByText('2 Attended')).toBeInTheDocument();
  });

  it('Should remove a team from the list', async () => {
    renderModal();

    await userEvent.click(
      screen.getByRole('button', { name: 'Remove Team Beta' }),
    );

    expect(
      screen.queryByRole('link', { name: 'Team Beta' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('1 Expected')).toBeInTheDocument();
  });

  it('Should collapse the list past ten teams and expand via "Show more"', async () => {
    const manyTeams: EventAttendanceTeam[] = Array.from(
      { length: 12 },
      (_, index) => ({
        teamId: `t${index}`,
        teamName: `Team ${index}`,
        attended: true,
      }),
    );
    renderModal({ teams: manyTeams });

    expect(screen.getAllByRole('listitem')).toHaveLength(10);
    expect(
      screen.queryByRole('link', { name: 'Team 11' }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Show 2 more' }));

    expect(screen.getAllByRole('listitem')).toHaveLength(12);
    expect(screen.getByRole('link', { name: 'Team 11' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Show .* more/ }),
    ).not.toBeInTheDocument();
  });

  it('Should remove a group-added team (not tracked as manual)', async () => {
    renderModal({
      teams: [],
      interestGroups: [{ id: 'ig2', name: 'Group Two' }],
    });

    await userEvent.click(screen.getByRole('button', { name: /Group Two/ }));
    await screen.findByRole('link', { name: 'Only Two' });

    await userEvent.click(
      screen.getByRole('button', { name: 'Remove Only Two' }),
    );

    expect(
      screen.queryByRole('link', { name: 'Only Two' }),
    ).not.toBeInTheDocument();
  });

  it('Should add all teams from an interest group', async () => {
    renderModal({ teams: [] });

    await userEvent.click(screen.getByRole('button', { name: /Alpha Group/ }));

    expect(onSelectInterestGroup).toHaveBeenCalledWith('ig1');
    expect(
      await screen.findByRole('link', { name: 'Group Team' }),
    ).toBeInTheDocument();
  });

  it('Should add a team from the search field', async () => {
    renderModal({ teams: [] });

    await userEvent.type(screen.getByRole('combobox'), 'Sea');
    await userEvent.click(await screen.findByText('Searched Team'));

    expect(loadSearchOptions).toHaveBeenCalled();
    expect(
      screen.getByRole('link', { name: 'Searched Team' }),
    ).toBeInTheDocument();
  });

  it('Should add all teams from an interest-group search result', async () => {
    renderModal({ teams: [] });

    await userEvent.type(screen.getByRole('combobox'), 'Sea');
    await userEvent.click(await screen.findByText('Searched Group'));

    expect(
      await screen.findByRole('link', { name: 'Group Search Team' }),
    ).toBeInTheDocument();
  });

  it('Should flag a fully-added group in the search results', async () => {
    renderModal({
      teams: [
        { teamId: 'sgt-1', teamName: 'Group Search Team', attended: true },
      ],
    });

    await userEvent.type(screen.getByRole('combobox'), 'Sea');

    expect(
      await screen.findByText('• all teams already added'),
    ).toBeInTheDocument();
  });

  it('Should show a no-matches message when the search returns nothing', async () => {
    renderModal({ teams: [], loadSearchOptions: jest.fn(async () => []) });

    await userEvent.type(screen.getByRole('combobox'), 'zzz');

    expect(
      await screen.findByText('Sorry, no matches for zzz.'),
    ).toBeInTheDocument();
  });

  it('Should not show the search dropdown before the user types', async () => {
    renderModal({ teams: [], loadSearchOptions: jest.fn(async () => []) });

    await userEvent.click(screen.getByRole('combobox'));

    expect(screen.queryByText(/Sorry, no matches/)).not.toBeInTheDocument();

    await userEvent.type(screen.getByRole('combobox'), 'z');
    expect(
      await screen.findByText('Sorry, no matches for z.'),
    ).toBeInTheDocument();
  });

  it('Should render both the full and shortened search placeholders (one shown per breakpoint via CSS)', () => {
    renderModal({ teams: [] });

    expect(
      screen.getByText('Search for a team or interest group to add…'),
    ).toBeInTheDocument();
    expect(screen.getByText('Search team or group…')).toBeInTheDocument();
  });

  it('Should toggle an interest group on and off', async () => {
    renderModal({
      teams: [],
      interestGroups: [{ id: 'ig2', name: 'Group Two' }],
    });

    await userEvent.click(screen.getByRole('button', { name: /Group Two/ }));
    expect(
      await screen.findByRole('link', { name: 'Only Two' }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Group Two/ }));
    await waitFor(() =>
      expect(
        screen.queryByRole('link', { name: 'Only Two' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('Should keep shared teams when one of two groups is toggled off', async () => {
    renderModal({
      teams: [],
      interestGroups: [
        { id: 'ig2', name: 'Group Two' },
        { id: 'ig3', name: 'Group Three' },
      ],
    });

    await userEvent.click(screen.getByRole('button', { name: /Group Two/ }));
    await screen.findByRole('link', { name: 'Only Two' });
    await userEvent.click(screen.getByRole('button', { name: /Group Three/ }));
    await screen.findByRole('link', { name: 'Only Three' });

    await userEvent.click(screen.getByRole('button', { name: /Group Two/ }));

    await waitFor(() =>
      expect(
        screen.queryByRole('link', { name: 'Only Two' }),
      ).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole('link', { name: 'Shared Team' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Only Three' }),
    ).toBeInTheDocument();
  });

  it('Should keep a manually added team when a group is toggled off', async () => {
    renderModal({
      teams: [{ teamId: 'shared', teamName: 'Shared Team', attended: true }],
      interestGroups: [{ id: 'ig2', name: 'Group Two' }],
    });

    await userEvent.click(screen.getByRole('button', { name: /Group Two/ }));
    await screen.findByRole('link', { name: 'Only Two' });

    await userEvent.click(screen.getByRole('button', { name: /Group Two/ }));

    await waitFor(() =>
      expect(
        screen.queryByRole('link', { name: 'Only Two' }),
      ).not.toBeInTheDocument(),
    );
    // 'Shared Team' was seeded (manual), so toggling the group off keeps it.
    expect(
      screen.getByRole('link', { name: 'Shared Team' }),
    ).toBeInTheDocument();
  });

  it('Should render every interest group when there are more than three', () => {
    renderModal({
      teams: [],
      interestGroups: [
        { id: 'ig1', name: 'Group One' },
        { id: 'ig2', name: 'Group Two' },
        { id: 'ig3', name: 'Group Three' },
        { id: 'ig4', name: 'Group Four' },
      ],
    });

    expect(
      screen.getByRole('button', { name: /Group Four/ }),
    ).toBeInTheDocument();
  });

  it('Should add teams uploaded from a list', async () => {
    const { container } = renderModal({ teams: [] });

    const fileInput = container.querySelector('input[type="file"]');
    await userEvent.upload(
      fileInput as HTMLInputElement,
      new File(['team'], 'teams.csv', { type: 'text/csv' }),
    );

    expect(onUploadList).toHaveBeenCalled();
    expect(
      await screen.findByRole('link', { name: 'Uploaded Team' }),
    ).toBeInTheDocument();
  });

  it('Should ignore an upload with no file selected', () => {
    const { container } = renderModal({ teams: [] });

    const fileInput = container.querySelector('input[type="file"]');
    fireEvent.change(fileInput as HTMLInputElement, {
      target: { files: [] },
    });

    expect(onUploadList).not.toHaveBeenCalled();
  });

  it('Should open the file picker when the upload button is clicked', async () => {
    const { container } = renderModal({ teams: [] });

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = jest
      .spyOn(fileInput, 'click')
      .mockImplementation(() => {});

    await userEvent.click(
      screen.getByRole('button', { name: /Upload a list/ }),
    );

    expect(clickSpy).toHaveBeenCalled();
  });

  it('Should not add a team that is already in the list', async () => {
    renderModal({
      teams: [{ teamId: 'ig-team-1', teamName: 'Group Team', attended: false }],
    });

    await userEvent.click(screen.getByRole('button', { name: /Alpha Group/ }));

    await waitFor(() => expect(onSelectInterestGroup).toHaveBeenCalled());
    expect(screen.getAllByRole('link', { name: 'Group Team' })).toHaveLength(1);
    expect(screen.getByText('1 Expected')).toBeInTheDocument();
  });

  it('Should call onSave with the current teams', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(teams));
  });

  it('Should stay usable when saving fails', async () => {
    renderModal({ onSave: jest.fn().mockRejectedValue(new Error('nope')) });

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    // The modal must unlock so the user can retry or cancel.
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled(),
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  });

  it('Should close immediately on cancel when nothing has changed', async () => {
    renderModal();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('button', { name: 'Discard changes' }),
    ).not.toBeInTheDocument();
  });

  it('Should confirm before discarding and call onDismiss on "Discard changes"', async () => {
    renderModal();

    // Make a change so the discard confirmation is warranted.
    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Team Beta attendance' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.getByText("You'll lose all unsaved changes if you cancel now."),
    ).toBeInTheDocument();
    expect(onDismiss).not.toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole('button', { name: 'Discard changes' }),
    );
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('Should return to editing when "Keep Editing" is clicked', async () => {
    renderModal();

    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Team Beta attendance' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await userEvent.click(screen.getByRole('button', { name: 'Keep Editing' }));

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Discard changes' }),
    ).not.toBeInTheDocument();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('Should open the discard confirmation from the close (X) button when dirty', async () => {
    renderModal();

    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Team Beta attendance' }),
    );
    // The Modal's Overlay also renders a disabled aria-label="Close" backdrop;
    // target the enabled header close button.
    const closeButton = screen
      .getAllByRole('button', { name: 'Close' })
      .find((button) => !(button as HTMLButtonElement).disabled);
    await userEvent.click(closeButton as HTMLElement);

    expect(
      screen.getByRole('button', { name: 'Discard changes' }),
    ).toBeInTheDocument();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('Should hide the optional group and upload sections when their props are absent', () => {
    renderModal({
      teams: [],
      interestGroups: [],
      onSelectInterestGroup: undefined,
      onUploadList: undefined,
    });

    expect(
      screen.queryByRole('button', { name: /Alpha Group/ }),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Upload a list')).not.toBeInTheDocument();
  });

  it('Should hide the group pills when there are no interest groups', () => {
    renderModal({ teams: [], interestGroups: [] });

    expect(
      screen.queryByText("Add teams from this event's groups"),
    ).not.toBeInTheDocument();
  });

  it('Should default to an empty list when attendees and groups are omitted', () => {
    render(
      <StaticRouter location="/">
        <EditEventAttendanceModal
          loadSearchOptions={loadSearchOptions}
          onSave={onSave}
          onDismiss={onDismiss}
        />
      </StaticRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Add Attendance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Add teams to track attendance'),
    ).toBeInTheDocument();
  });
});
