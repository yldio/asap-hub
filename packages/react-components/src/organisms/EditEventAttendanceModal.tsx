import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { components } from 'react-select';

import {
  Button,
  Headline2,
  Link,
  MultiSelect,
  MultiSelectOptionsType,
  Paragraph,
  Switch,
} from '../atoms';
import {
  charcoal,
  lead,
  neutral800,
  neutral1000,
  paper,
  pearl,
  steel,
  tin,
} from '../colors';
import {
  binIcon,
  crossIcon,
  InterestGroupsIcon,
  plusIcon,
  searchIcon,
  TeamIcon,
  tickSmallIcon,
  uploadIcon,
} from '../icons';
import { Modal } from '../molecules';
import { mobileScreen, rem } from '../pixels';
import { noop } from '../utils';
import {
  EventAttendanceTeam,
  iconButtonStyles,
  teamIcon,
} from './EventAttendance';

export type AttendanceSearchOption = MultiSelectOptionsType &
  (
    | {
        optionType: 'team';
        teamType?: EventAttendanceTeam['teamType'];
        isTeamInactive?: boolean;
      }
    | { optionType: 'interestGroup'; teams: EventAttendanceTeam[] }
  );

type EditEventAttendanceModalProps = {
  teams?: EventAttendanceTeam[];
  interestGroups?: ReadonlyArray<{ id: string; name: string }>;
  loadSearchOptions: (inputValue: string) => Promise<AttendanceSearchOption[]>;
  onSelectInterestGroup?: (
    interestGroupId: string,
  ) => Promise<EventAttendanceTeam[]>;
  onUploadList?: (file: File) => Promise<EventAttendanceTeam[]>;
  onSave: (teams: EventAttendanceTeam[]) => void | Promise<void>;
  onDismiss: () => void;
};

const defaultVisibleTeams = 10;

const modalStyles = css({
  width: '100%',
});

const headerStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(15),
  padding: `${rem(32)} ${rem(24)} 0`,
});

const titleStyles = css({
  fontSize: rem(26),
  fontWeight: 700,
  lineHeight: rem(32),
  color: neutral1000.rgb,
});

const bodyStyles = css({
  display: 'flex',
  flexDirection: 'column',
  padding: `0 ${rem(24)}`,
});

const spacingMedium = css({ marginTop: rem(32) });
const spacingLarge = css({ marginTop: rem(48) });

const sectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
});

const uploadSectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(16),
});

const uploadTextStyles = css({
  display: 'flex',
  flexDirection: 'column',
});

const sectionTitleStyles = css({
  margin: 0,
  fontSize: rem(17),
  fontWeight: 700,
  lineHeight: rem(24),
  color: neutral1000.rgb,
});

const optionalLabelStyles = css({ fontWeight: 400 });

const SectionTitle: React.FC<{
  children: React.ReactNode;
  optional?: boolean;
}> = ({ children, optional = false }) => (
  <h3 css={sectionTitleStyles}>
    {children}
    {optional && <span css={optionalLabelStyles}> (optional)</span>}
  </h3>
);

const buttonIconGapReset = { '> svg + span': { marginLeft: 0 } } as const;

const uploadButtonStyles = css({
  alignSelf: 'flex-start',
  gap: rem(8),
  padding: `${rem(8)} ${rem(16)}`,
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(4),
  backgroundColor: paper.rgb,
  color: neutral1000.rgb,
  maxWidth: 'none',
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexGrow: 0,
    minWidth: 'auto',
  },
  '> svg': {
    width: rem(24),
    height: rem(24),
    stroke: neutral1000.rgb,
  },
  ...buttonIconGapReset,
});

const pillRowStyles = (columnCount: number, rowCount: number) =>
  css({
    display: 'grid',
    gap: rem(8),
    gridAutoFlow: 'column',
    gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
    gridTemplateRows: `repeat(${rowCount}, auto)`,
    [`@media (max-width: ${mobileScreen.max}px)`]: {
      gridAutoFlow: 'row',
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'none',
    },
  });

const pillStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  justifySelf: 'start',
  maxWidth: 'none',
  gap: rem(8),
  padding: `${rem(6)} ${rem(16)}`,
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(24),
  backgroundColor: paper.rgb,
  color: neutral1000.rgb,
  fontWeight: 'normal',
  cursor: 'pointer',
  '> svg': {
    width: rem(24),
    height: rem(24),
  },
  ...buttonIconGapReset,
});

const addedPillStyles = css({
  color: neutral800.rgb,
  backgroundColor: pearl.rgb,
  // Recolour only the tick (first icon); the interest-group icon is recoloured
  // via its own `color` prop to keep its outlined shapes intact.
  '> svg:first-of-type': {
    fill: neutral800.rgb,
  },
});

const attendeesHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: rem(12),
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: rem(24),
  },
});

const attendeesStatsStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: rem(4),
  },
});

const statsGroupStyles = css({
  display: 'flex',
  alignItems: 'center',
});

const attendeesStatStyles = css({
  fontSize: rem(17),
  fontWeight: 400,
  color: lead.rgb,
});

const separatorStyles = css({
  fontSize: rem(17),
  fontWeight: 400,
  color: lead.rgb,
  paddingLeft: rem(8),
  paddingRight: rem(8),
});

const hideOnMobileStyles = css({
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    display: 'none',
  },
});

const hideOnDesktopStyles = css({
  [`@media (min-width: ${mobileScreen.max + 1}px)`]: {
    display: 'none',
  },
});

const attendeesSectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    gap: rem(24),
  },
});

const markAllButtonStyles = css({
  flexGrow: 0,
});

const emptyAttendeesStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: rem(8),
  textAlign: 'center',
  padding: `${rem(32)} ${rem(24)}`,
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(8),
  backgroundColor: pearl.rgb,
});

const attendeesCardStyles = css({
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(8),
  backgroundColor: pearl.rgb,
  padding: rem(24),
  overflowX: 'auto',
});

const attendeesTableHeaderStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: rem(17),
  fontWeight: 'bold',
  color: charcoal.rgb,
  paddingBottom: rem(16),
});

const attendanceHeaderStyles = css({
  paddingRight: rem(24),
});

const attendeesRowsStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
});

const showMoreStyles = css({
  marginTop: rem(16),
});

const attendeeRowStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(16),
});

const teamCellStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    '> svg': {
      display: 'none',
    },
  },
});

const attendanceCellStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

const attendanceSwitchStyles = css({
  display: 'inline-flex',
  paddingRight: rem(24),
});

const deleteButtonStyles = css({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(24),
  minWidth: rem(24),
  height: rem(24),
  minHeight: rem(24),
  padding: 0,
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(4),
  backgroundColor: paper.rgb,
  color: neutral1000.rgb,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexGrow: 0,
    minWidth: rem(24),
  },
  '> svg': {
    width: rem(14.4),
    height: rem(14.4),
  },
});

const footerStyles = (isConfirmingCancel: boolean) =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: isConfirmingCancel ? 'space-between' : 'flex-end',
    gap: rem(24),
    padding: `${rem(48)} ${rem(24)} ${rem(24)}`,
    [`@media (max-width: ${mobileScreen.max}px)`]: {
      flexDirection: 'column',
      alignItems: 'stretch',
      paddingTop: rem(56),
    },
  });

const footerActionsStyles = css({
  display: 'flex',
  gap: rem(24),
  flexShrink: 0,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column-reverse',
  },
});

const footerButtonStyles = css({
  width: 'fit-content',
  flexShrink: 0,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    width: '100%',
  },
});

const footerButtonTextStyles = css({
  fontSize: rem(17),
  fontWeight: 700,
  lineHeight: rem(24),
  whiteSpace: 'nowrap',
});

const discardWarningStyles = css({
  fontWeight: 'bold',
  color: neutral1000.rgb,
});

const searchOptionStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  '> svg': {
    width: rem(24),
    height: rem(24),
    flexShrink: 0,
  },
});

const searchOptionMetaStyles = css({
  color: lead.rgb,
});

const placeholderStyles = css({
  color: tin.rgb,
});

const EditEventAttendanceModal: React.FC<EditEventAttendanceModalProps> = ({
  teams = [],
  interestGroups = [],
  loadSearchOptions,
  onSelectInterestGroup,
  onUploadList,
  onSave,
  onDismiss,
}) => {
  const [rows, setRows] = useState<EventAttendanceTeam[]>(() => [...teams]);
  // Each active interest group maps to the team ids it contributed, so toggling
  // a group off can drop only the teams no other group (or manual add) still owns.
  const [addedGroups, setAddedGroups] = useState<
    ReadonlyMap<string, ReadonlyArray<string>>
  >(() => new Map());
  const [manualTeamIds, setManualTeamIds] = useState<ReadonlySet<string>>(
    () => new Set(teams.map((team) => team.teamId)),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = teams.length > 0;
  const title = isEditMode ? 'Edit Attendance' : 'Add Attendance';

  const attendedCount = rows.filter((team) => team.attended).length;
  const saveEnabled = rows.length > 0 && !isSaving;
  const addedTeamIds = new Set(rows.map((team) => team.teamId));

  const visibleRows = expanded ? rows : rows.slice(0, defaultVisibleTeams);
  const hiddenCount = rows.length - visibleRows.length;

  const interestGroupColumns = interestGroups.length > 3 ? 2 : 1;
  const interestGroupRows = Math.ceil(
    interestGroups.length / interestGroupColumns,
  );

  const addTeams = (teamsToAdd: EventAttendanceTeam[]) =>
    setRows((current) => {
      const existingIds = new Set(current.map((team) => team.teamId));
      const additions = teamsToAdd.filter(
        (team) => !existingIds.has(team.teamId),
      );
      return [...current, ...additions];
    });

  const addManualTeams = (teamsToAdd: EventAttendanceTeam[]) => {
    addTeams(teamsToAdd);
    setManualTeamIds((prev) => {
      const next = new Set(prev);
      teamsToAdd.forEach((team) => next.add(team.teamId));
      return next;
    });
  };

  const addInterestGroup = (
    groupId: string,
    groupTeams: EventAttendanceTeam[],
  ) => {
    addTeams(groupTeams);
    setAddedGroups((prev) =>
      new Map(prev).set(
        groupId,
        groupTeams.map((team) => team.teamId),
      ),
    );
  };

  const removeInterestGroup = (groupId: string) => {
    const remaining = new Map(addedGroups);
    remaining.delete(groupId);
    const ownedByRemaining = new Set<string>();
    remaining.forEach((teamIds) =>
      teamIds.forEach((teamId) => ownedByRemaining.add(teamId)),
    );
    setRows((current) =>
      current.filter(
        (team) =>
          manualTeamIds.has(team.teamId) || ownedByRemaining.has(team.teamId),
      ),
    );
    setAddedGroups(remaining);
  };

  const handleSelectSearchOption = (option: AttendanceSearchOption | null) => {
    if (!option) {
      return;
    }
    if (option.optionType === 'interestGroup') {
      addInterestGroup(option.value, option.teams);
    } else {
      addManualTeams([
        {
          teamId: option.value,
          teamName: option.label,
          attended: true,
          teamType: option.teamType,
          isTeamInactive: option.isTeamInactive,
        },
      ]);
    }
  };

  const toggleAttended = (teamId: string) =>
    setRows((current) =>
      current.map((team) =>
        team.teamId === teamId ? { ...team, attended: !team.attended } : team,
      ),
    );

  const removeTeam = (teamId: string) => {
    setRows((current) => current.filter((team) => team.teamId !== teamId));
    setManualTeamIds((prev) => {
      if (!prev.has(teamId)) {
        return prev;
      }
      const next = new Set(prev);
      next.delete(teamId);
      return next;
    });
    // Drop the team from any interest group that contributed it, and stop
    // treating a group as "added" once it has no teams left.
    setAddedGroups((prev) => {
      const next = new Map<string, ReadonlyArray<string>>();
      prev.forEach((teamIds, groupId) => {
        const remaining = teamIds.filter((id) => id !== teamId);
        if (remaining.length > 0) {
          next.set(groupId, remaining);
        }
      });
      return next;
    });
  };

  const markAllAttended = () =>
    setRows((current) => current.map((team) => ({ ...team, attended: true })));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(rows);
    } catch {
      // The caller surfaces the error; the modal only needs to unlock so the
      // user can retry or cancel instead of staying stuck on "saving".
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty =
    rows.length !== teams.length ||
    rows.some(
      (row, index) =>
        row.teamId !== teams[index]?.teamId ||
        row.attended !== teams[index]?.attended,
    );

  const handleCancel = () => (isDirty ? setIsCancelling(true) : onDismiss());

  return (
    <Modal padding={false} overrideModalStyles={modalStyles}>
      <header css={headerStyles}>
        <Headline2 noMargin overrideStyles={titleStyles}>
          {title}
        </Headline2>
        <Button
          small
          noMargin
          aria-label="Close"
          enabled={!isSaving}
          onClick={handleCancel}
          overrideStyles={iconButtonStyles}
        >
          {crossIcon}
        </Button>
      </header>

      <div css={bodyStyles}>
        {onSelectInterestGroup && interestGroups.length > 0 && (
          <section css={[sectionStyles, spacingMedium]}>
            <SectionTitle optional>
              Add teams from this event&apos;s groups
            </SectionTitle>
            <div css={pillRowStyles(interestGroupColumns, interestGroupRows)}>
              {interestGroups.map((group) => {
                const added = addedGroups.has(group.id);
                return (
                  <Button
                    key={group.id}
                    noMargin
                    overrideStyles={css([pillStyles, added && addedPillStyles])}
                    onClick={() => {
                      if (added) {
                        removeInterestGroup(group.id);
                      } else {
                        void onSelectInterestGroup(group.id)
                          .then((groupTeams) =>
                            addInterestGroup(group.id, groupTeams),
                          )
                          .catch(noop);
                      }
                    }}
                  >
                    {added ? tickSmallIcon : plusIcon}
                    <InterestGroupsIcon
                      color={added ? neutral800.rgb : undefined}
                    />
                    {group.name}
                  </Button>
                );
              })}
            </div>
          </section>
        )}

        <div css={spacingMedium}>
          <MultiSelect<AttendanceSearchOption, false>
            isMulti={false}
            values={null}
            noMargin
            defaultOptions={false}
            leftIndicator={searchIcon}
            loadOptions={(inputValue) => loadSearchOptions(inputValue)}
            onChange={handleSelectSearchOption}
            noOptionsMessage={({ inputValue }) =>
              `Sorry, no matches for ${inputValue}.`
            }
            components={{
              Placeholder: (placeholderProps) => (
                <components.Placeholder {...placeholderProps}>
                  <span css={[placeholderStyles, hideOnMobileStyles]}>
                    Search for a team or interest group to add…
                  </span>
                  <span css={[placeholderStyles, hideOnDesktopStyles]}>
                    Search team or group…
                  </span>
                </components.Placeholder>
              ),
              Menu: (menuProps) =>
                menuProps.selectProps.inputValue ? (
                  <components.Menu {...menuProps} />
                ) : null,
              Option: (optionProps) => {
                const option = optionProps.data;
                const allAdded =
                  option.optionType === 'interestGroup' &&
                  option.teams.every((team) => addedTeamIds.has(team.teamId));
                return (
                  <components.Option {...optionProps}>
                    <span css={searchOptionStyles}>
                      {option.optionType === 'interestGroup' ? (
                        <InterestGroupsIcon />
                      ) : (
                        <TeamIcon />
                      )}
                      <span>{option.label}</span>
                      {option.optionType === 'interestGroup' && (
                        <span css={searchOptionMetaStyles}>
                          {allAdded
                            ? '• all teams already added'
                            : `• adds ${option.teams.length} teams`}
                        </span>
                      )}
                    </span>
                  </components.Option>
                );
              },
            }}
          />
        </div>

        {onUploadList && (
          <section css={[uploadSectionStyles, spacingLarge]}>
            <div css={uploadTextStyles}>
              <SectionTitle optional>Upload a list</SectionTitle>
              <Paragraph noMargin accent="lead">
                Add several teams at once from a spreadsheet, instead of
                searching one by one.
              </Paragraph>
            </div>
            <input
              ref={uploadInputRef}
              type="file"
              accept=".csv,.xls,.xlsx"
              aria-label="Upload a list"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void onUploadList(file).then(addTeams).catch(noop);
                }
              }}
            />
            <Button
              noMargin
              overrideStyles={uploadButtonStyles}
              onClick={() => uploadInputRef.current?.click()}
            >
              {uploadIcon}
              Upload a list
            </Button>
          </section>
        )}

        <section css={[attendeesSectionStyles, spacingLarge]}>
          <div css={attendeesHeaderStyles}>
            <div css={attendeesStatsStyles}>
              <SectionTitle>Attendees</SectionTitle>
              {rows.length > 0 && (
                <span css={statsGroupStyles}>
                  <span css={[separatorStyles, hideOnMobileStyles]}>•</span>
                  <span css={attendeesStatStyles}>{rows.length} Expected</span>
                  <span css={separatorStyles}>•</span>
                  <span css={attendeesStatStyles}>
                    {attendedCount} Attended
                  </span>
                </span>
              )}
            </div>
            {rows.length > 0 && (
              <Button
                small
                noMargin
                overrideStyles={markAllButtonStyles}
                onClick={markAllAttended}
              >
                Mark All Attended
              </Button>
            )}
          </div>

          {rows.length === 0 ? (
            <div css={emptyAttendeesStyles} role="status">
              <Paragraph noMargin accent="lead">
                <strong>Add teams to track attendance</strong>
              </Paragraph>
              <Paragraph noMargin accent="lead">
                Pick an interest group above, search for a team, copy a past
                event, or upload a list.
              </Paragraph>
            </div>
          ) : (
            <div css={attendeesCardStyles}>
              <div css={attendeesTableHeaderStyles}>
                <span>Team</span>
                <span css={attendanceHeaderStyles}>Attendance</span>
              </div>
              <div css={attendeesRowsStyles} role="list">
                {visibleRows.map((team) => (
                  <div
                    key={team.teamId}
                    css={attendeeRowStyles}
                    role="listitem"
                  >
                    <span css={teamCellStyles}>
                      {teamIcon(team.teamType)}
                      <Link
                        href={
                          network({}).teams({}).team({ teamId: team.teamId }).$
                        }
                      >
                        {team.teamName}
                      </Link>
                    </span>
                    <span css={attendanceCellStyles}>
                      <span css={attendanceSwitchStyles}>
                        <Switch
                          checked={team.attended}
                          uncheckedColor="error"
                          ariaLabel={`${team.teamName} attendance`}
                          onClick={() => toggleAttended(team.teamId)}
                        />
                      </span>
                      <Button
                        noMargin
                        aria-label={`Remove ${team.teamName}`}
                        onClick={() => removeTeam(team.teamId)}
                        overrideStyles={deleteButtonStyles}
                      >
                        {binIcon}
                      </Button>
                    </span>
                  </div>
                ))}
              </div>
              {hiddenCount > 0 && (
                <div css={showMoreStyles}>
                  <Button linkStyle onClick={() => setExpanded(true)}>
                    Show {hiddenCount} more
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <footer css={footerStyles(isCancelling)}>
        {isCancelling && (
          <span css={discardWarningStyles}>
            You&apos;ll lose all unsaved changes if you cancel now.
          </span>
        )}
        <div css={footerActionsStyles}>
          {isCancelling ? (
            <>
              <div css={footerButtonStyles}>
                <Button
                  fullWidth
                  noMargin
                  overrideStyles={footerButtonTextStyles}
                  onClick={() => setIsCancelling(false)}
                >
                  Keep Editing
                </Button>
              </div>
              <div css={footerButtonStyles}>
                <Button
                  warning
                  fullWidth
                  noMargin
                  overrideStyles={footerButtonTextStyles}
                  onClick={onDismiss}
                >
                  Discard changes
                </Button>
              </div>
            </>
          ) : (
            <>
              <div css={footerButtonStyles}>
                <Button
                  fullWidth
                  noMargin
                  enabled={!isSaving}
                  overrideStyles={footerButtonTextStyles}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
              <div css={footerButtonStyles}>
                <Button
                  primary
                  fullWidth
                  noMargin
                  enabled={saveEnabled}
                  loading={isSaving}
                  overrideStyles={footerButtonTextStyles}
                  onClick={() => {
                    void handleSave();
                  }}
                >
                  Save
                </Button>
              </div>
            </>
          )}
        </div>
      </footer>
    </Modal>
  );
};

export default EditEventAttendanceModal;
