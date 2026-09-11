import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';
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
  neutral200,
  neutral800,
  neutral1000,
  pearl,
  steel,
  tin,
} from '../colors';
import {
  binIcon,
  InactiveBadgeIcon,
  crossIcon,
  InterestGroupsIcon,
  lockSmallIcon,
  searchIcon,
  TeamIcon,
  uploadIcon,
} from '../icons';
import { ConfirmableModalFooter, Modal } from '../molecules';
import { mobileScreen, rem } from '../pixels';
import { pluralizeTeams } from '../utils';
import { EventAttendanceTeam } from './EventAttendance';
import { teamIcon } from './shared-event-card';
import {
  deleteButtonStyles,
  iconButtonStyles,
} from './shared-event-card-styles';
import SourceLists from './SourceLists';
import Toast from './Toast';
import UploadListModal, {
  UploadListResult,
  UploadListSourceFile,
} from './UploadListModal';

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
  interestGroupName?: string;
  loadSearchOptions: (inputValue: string) => Promise<AttendanceSearchOption[]>;
  onUploadList?: (files: File[]) => Promise<UploadListResult>;
  sourceLists?: UploadListSourceFile[];
  onSave: (teams: EventAttendanceTeam[]) => void | Promise<void>;
  onDismiss: () => void;
};

// Rows past this count are hidden behind the section's own "Show more".
const visibleTeamsPerSection = 5;

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

const spacingLarge = css({ marginTop: rem(48) });

// The upload section is hidden on mobile, so the search field needs its own
// wider top/bottom spacing there (48 above, 56 below).
const searchSpacingStyles = css({
  marginTop: rem(32),
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    marginTop: rem(48),
  },
});

const attendeesSpacingStyles = css({
  marginTop: rem(48),
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    marginTop: rem(56),
  },
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

const uploadButtonStyles = (enabled: boolean) =>
  css({
    alignSelf: 'flex-start',
    gap: rem(8),
    padding: `${rem(8)} ${rem(16)}`,
    border: `1px solid ${steel.rgb}`,
    borderRadius: rem(4),
    color: enabled ? neutral1000.rgb : lead.rgb,
    maxWidth: 'none',
    [`@media (max-width: ${mobileScreen.max}px)`]: {
      flexGrow: 0,
      minWidth: 'auto',
    },
    '> svg': {
      width: rem(24),
      height: rem(24),
      stroke: enabled ? neutral1000.rgb : lead.rgb,
      filter: 'none',
    },
    ...buttonIconGapReset,
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

const attendeesCardStyles = (enabled: boolean) =>
  css({
    border: `1px solid ${steel.rgb}`,
    borderRadius: rem(8),
    backgroundColor: enabled ? pearl.rgb : neutral200.rgb,
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

const attendeesGroupsStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
});

const attendeesGroupStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
});

const groupHeaderStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
});

const groupTitleStyles = css({
  margin: 0,
  fontSize: rem(14),
  fontWeight: 400,
  lineHeight: rem(16),
  color: neutral1000.rgb,
});

const groupHelperStyles = css({
  margin: 0,
  fontSize: rem(14),
  fontWeight: 400,
  lineHeight: rem(16),
  color: neutral800.rgb,
});

const lockStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(24),
  height: rem(24),
  flexShrink: 0,
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

const AttendeeGroup: React.FC<{
  title: string;
  helperText?: string;
  teams: EventAttendanceTeam[];
  // Interest-group teams can be toggled but not removed, so they show a lock
  // where the removable rows show their bin button.
  locked?: boolean;
  enabled: boolean;
  onToggleAttended: (teamId: string) => void;
  onRemove: (teamId: string) => void;
}> = ({
  title,
  helperText,
  teams,
  locked = false,
  enabled,
  onToggleAttended,
  onRemove,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleTeams = expanded
    ? teams
    : teams.slice(0, visibleTeamsPerSection);
  const hiddenCount = teams.length - visibleTeams.length;

  return (
    <div css={attendeesGroupStyles}>
      <div css={groupHeaderStyles}>
        <p css={groupTitleStyles}>
          {title} ({teams.length})
        </p>
        {helperText && <p css={groupHelperStyles}>{helperText}</p>}
      </div>
      <div css={attendeesRowsStyles} role="list">
        {visibleTeams.map((team) => (
          <div key={team.teamId} css={attendeeRowStyles} role="listitem">
            <span css={teamCellStyles}>
              {teamIcon(team.teamType)}
              <Link
                href={network({}).teams({}).team({ teamId: team.teamId }).$}
              >
                {team.teamName}
              </Link>
              {team.isTeamInactive && <InactiveBadgeIcon />}
            </span>
            <span css={attendanceCellStyles}>
              <span css={attendanceSwitchStyles}>
                <Switch
                  size="large"
                  checked={team.attended}
                  enabled={enabled}
                  ariaLabel={`${team.teamName} attendance`}
                  onClick={() => onToggleAttended(team.teamId)}
                />
              </span>
              {locked ? (
                <span css={lockStyles}>{lockSmallIcon}</span>
              ) : (
                <Button
                  noMargin
                  enabled={enabled}
                  aria-label={`Remove ${team.teamName}`}
                  onClick={() => onRemove(team.teamId)}
                  overrideStyles={deleteButtonStyles(enabled, 'light')}
                >
                  {binIcon}
                </Button>
              )}
            </span>
          </div>
        ))}
      </div>
      {(hiddenCount > 0 || expanded) && (
        <div>
          <Button linkStyle onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show less' : `Show ${hiddenCount} more`}
          </Button>
        </div>
      )}
    </div>
  );
};

const EditEventAttendanceModal: React.FC<EditEventAttendanceModalProps> = ({
  teams = [],
  interestGroupName,
  loadSearchOptions,
  onUploadList,
  sourceLists = [],
  onSave,
  onDismiss,
}) => {
  const [rows, setRows] = useState<EventAttendanceTeam[]>(() => [...teams]);
  const [showUploadList, setShowUploadList] = useState(false);
  const [sourceFiles, setSourceFiles] =
    useState<UploadListSourceFile[]>(sourceLists);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaveError, setHasSaveError] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const isEditMode = teams.length > 0;
  const title = isEditMode ? 'Edit Attendance' : 'Add Attendance';

  const attendedCount = rows.filter((team) => team.attended).length;
  const allAttended = rows.length > 0 && attendedCount === rows.length;
  const saveEnabled = rows.length > 0 && !isSaving;
  const addedTeamIds = new Set(rows.map((team) => team.teamId));

  const interestGroupRows = rows.filter((team) => team.isFromInterestGroup);
  const additionalRows = rows.filter((team) => !team.isFromInterestGroup);

  const addTeams = (teamsToAdd: EventAttendanceTeam[]) =>
    setRows((current) => {
      const existingIds = new Set(current.map((team) => team.teamId));
      const additions = teamsToAdd.filter(
        (team) => !existingIds.has(team.teamId),
      );
      return [...current, ...additions];
    });

  // Upsert kept separate from addTeams so the search path stays append-only: an
  // existing row keeps its attendanceId (and its interest-group provenance) and
  // takes the uploaded status; a new team is appended.
  const applyUploadedTeams = (teamsToApply: EventAttendanceTeam[]) =>
    setRows((current) => {
      const byId = new Map(current.map((team) => [team.teamId, team]));
      teamsToApply.forEach((team) =>
        byId.set(team.teamId, { ...byId.get(team.teamId), ...team }),
      );
      return [...byId.values()];
    });

  const handleUploadAddAttendees = (
    uploadedTeams: EventAttendanceTeam[],
    files: File[],
  ) => {
    applyUploadedTeams(uploadedTeams);
    const addedDate = new Date().toLocaleDateString('en-GB');
    setSourceFiles((current) => [
      ...current,
      ...files.map((file, index) => ({
        id: `${file.name}-${current.length + index}`,
        filename: file.name,
        addedDate,
        onDownload: () => {
          const url = URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = file.name;
          anchor.click();
          // Defer so the click-triggered download can read the blob before the
          // URL is revoked (a synchronous revoke cancels it in Firefox/Safari).
          setTimeout(() => URL.revokeObjectURL(url), 0);
        },
      })),
    ]);
    setShowUploadList(false);
  };

  const handleSelectSearchOption = (option: AttendanceSearchOption) => {
    if (option.optionType === 'interestGroup') {
      addTeams(option.teams);
    } else {
      addTeams([
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

  const removeTeam = (teamId: string) =>
    setRows((current) => current.filter((team) => team.teamId !== teamId));

  const toggleMarkAllAttended = () =>
    setRows((current) =>
      current.map((team) => ({ ...team, attended: !allAttended })),
    );

  const handleSave = async () => {
    setIsSaving(true);
    setHasSaveError(false);
    try {
      await onSave(rows);
    } catch {
      setHasSaveError(true);
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

  if (showUploadList && onUploadList) {
    return (
      <UploadListModal
        onUploadList={onUploadList}
        onAddAttendees={handleUploadAddAttendees}
        onBack={() => setShowUploadList(false)}
        currentTeamIds={new Set(rows.map((team) => team.teamId))}
      />
    );
  }

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
        {hasSaveError && (
          <Toast>An error has occurred. Please try again later.</Toast>
        )}
        <div css={searchSpacingStyles}>
          <MultiSelect<AttendanceSearchOption, false>
            isMulti={false}
            values={null}
            noMargin
            enabled={!isCancelling}
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
                            : `• adds ${pluralizeTeams(option.teams.length)}`}
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
          <section
            css={[uploadSectionStyles, spacingLarge, hideOnMobileStyles]}
          >
            <div css={uploadTextStyles}>
              <SectionTitle optional>Upload a list</SectionTitle>
              <Paragraph noMargin accent="lead">
                Add several teams at once from a spreadsheet, instead of
                searching one by one.
              </Paragraph>
            </div>
            <Button
              noMargin
              enabled={!isCancelling}
              overrideStyles={uploadButtonStyles(!isCancelling)}
              onClick={() => setShowUploadList(true)}
            >
              {uploadIcon}
              Upload a List
            </Button>
          </section>
        )}

        <section css={[attendeesSectionStyles, attendeesSpacingStyles]}>
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
                enabled={!isCancelling}
                overrideStyles={markAllButtonStyles}
                onClick={toggleMarkAllAttended}
              >
                {allAttended ? 'Mark All Not Attended' : 'Mark All Attended'}
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
            <div css={attendeesCardStyles(!isCancelling)}>
              <div css={attendeesTableHeaderStyles}>
                <span>Team</span>
                <span css={attendanceHeaderStyles}>Attendance</span>
              </div>
              <div css={attendeesGroupsStyles}>
                {interestGroupRows.length > 0 && (
                  <AttendeeGroup
                    title={
                      interestGroupName
                        ? `From ${interestGroupName}`
                        : 'From interest group'
                    }
                    helperText="Added automatically because this group is hosting. These cannot be removed."
                    teams={interestGroupRows}
                    locked
                    enabled={!isCancelling}
                    onToggleAttended={toggleAttended}
                    onRemove={removeTeam}
                  />
                )}
                {additionalRows.length > 0 && (
                  <AttendeeGroup
                    title="Additional teams"
                    teams={additionalRows}
                    enabled={!isCancelling}
                    onToggleAttended={toggleAttended}
                    onRemove={removeTeam}
                  />
                )}
              </div>
            </div>
          )}
        </section>

        <SourceLists files={sourceFiles} />
      </div>

      <ConfirmableModalFooter
        isConfirming={isCancelling}
        confirmationMessage="You'll lose all unsaved changes if you cancel now."
        onKeepEditing={() => setIsCancelling(false)}
        onDiscard={onDismiss}
        onCancel={handleCancel}
        cancelEnabled={!isSaving}
        confirmLabel="Save"
        onConfirm={() => {
          void handleSave();
        }}
        confirmEnabled={saveEnabled}
        confirmLoading={isSaving}
      />
    </Modal>
  );
};

export default EditEventAttendanceModal;
