import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useRef, useState } from 'react';

import { Button, Headline2, Link, Paragraph, Tag } from '../atoms';
import {
  error500,
  error900,
  fern,
  lead,
  neutral1000,
  paper,
  pearl,
  steel,
} from '../colors';
import {
  binIcon,
  chevronDownIcon,
  crossIcon,
  crossSmallIcon,
  chevronLeftIcon,
  plusIcon,
  tickSmallIcon,
} from '../icons';
import { ConfirmableModalFooter, Modal } from '../molecules';
import { rem } from '../pixels';
import {
  EventAttendanceTeam,
  EventAttendanceTeamType,
} from './EventAttendance';
import { teamIcon } from './shared-event-card';
import { iconButtonStyles } from './shared-event-card-styles';

export type UploadListSuggestion = {
  teamId: string;
  teamName: string;
  teamType?: EventAttendanceTeamType;
};

export type UploadListUnmatchedTeam = {
  name: string;
  suggestion?: UploadListSuggestion;
};

export type UploadListResult = {
  matched: EventAttendanceTeam[];
  alreadyInCount: number;
  unmatched: UploadListUnmatchedTeam[];
};

export type UploadListSourceFile = {
  id: string;
  filename: string;
  addedDate?: string;
  onDownload?: () => void | Promise<void>;
};

type UploadListModalProps = {
  onUploadList: (files: File[]) => Promise<UploadListResult>;
  onAddAttendees: (
    teams: EventAttendanceTeam[],
    files: File[],
  ) => void | Promise<void>;
  onBack: () => void;
  maxFileSizeMb?: number;
  accept?: string;
  initialFiles?: File[];
  initialResult?: UploadListResult | null;
  initialSectionsOpen?: boolean;
};

const defaultMaxFileSizeMb = 10;
const defaultAccept = '.csv,.xlsx';

const modalStyles = css({
  width: '100%',
});

const headerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(15),
  padding: `${rem(32)} ${rem(24)} 0`,
});

const headerTitleStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(16),
  flex: 1,
});

const titleStyles = css({
  fontSize: rem(26),
  fontWeight: 700,
  lineHeight: rem(32),
  color: neutral1000.rgb,
});

const headerIconStyles = css({
  justifyContent: 'center',
  '> svg': {
    width: rem(24),
    height: rem(24),
    padding: 0,
  },
});

const bodyStyles = css({
  display: 'flex',
  flexDirection: 'column',
  padding: `${rem(32)} ${rem(24)} 0`,
});

const uploadSectionStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(16),
  marginTop: rem(16),
});

const resultStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
  marginTop: rem(32),
});

const chipsStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(8),
});

const buttonIconGapReset = { '> svg + span': { marginLeft: 0 } } as const;

const addButtonStyles = css({
  alignSelf: 'flex-start',
  alignItems: 'center',
  gap: rem(8),
  maxWidth: 'none',
  lineHeight: rem(24),
  '> svg': {
    width: rem(24),
    height: rem(24),
    paddingTop: rem(2),
    paddingBottom: rem(2),
  },
  ...buttonIconGapReset,
});

const errorStyles = css({
  margin: 0,
  color: error500.rgb,
  fontSize: rem(17),
  fontWeight: 400,
  lineHeight: rem(24),
  letterSpacing: 0,
});

const summaryStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  fontSize: rem(17),
  lineHeight: rem(24),
  color: lead.rgb,
});

const summaryStrongStyles = css({
  fontWeight: 700,
  color: neutral1000.rgb,
});

const summarySeparatorStyles = css({
  paddingLeft: rem(8),
  paddingRight: rem(8),
});

const resultCardStyles = css({
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(8),
  backgroundColor: pearl.rgb,
  overflow: 'hidden',
});

const sectionHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(16),
  width: '100%',
  padding: rem(16),
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: rem(17),
  lineHeight: rem(24),
  textAlign: 'left',
  color: neutral1000.rgb,
});

const sectionHeaderLabelStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
  '> svg': {
    width: rem(24),
    height: rem(24),
    flexShrink: 0,
  },
});

const matchedLabelStyles = css({
  color: lead.rgb,
  fontWeight: 400,
  gap: rem(8),
  strong: {
    fontWeight: 700,
  },
});

const notMatchedLabelStyles = css({
  color: error900.rgb,
  gap: rem(8),
  '> svg': {
    fill: error900.rgb,
  },
});

const chevronStyles = (open: boolean) =>
  css({
    display: 'flex',
    transition: 'transform 0.2s',
    transform: open ? 'rotate(180deg)' : 'none',
    '> svg': {
      width: rem(24),
      height: rem(24),
    },
  });

const dividerStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
});

const sectionBodyStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
  padding: `0 ${rem(16)} ${rem(16)} ${rem(48)}`,
});

const matchedRowStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(16),
});

const matchedTeamStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  color: fern.rgb,
  '> svg': {
    width: rem(24),
    height: rem(24),
    flexShrink: 0,
  },
});

const matchedTeamNameStyles = css({
  color: fern.rgb,
  fontWeight: 400,
});

const deleteButtonStyles = css({
  flexGrow: 0,
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
  '> svg': {
    width: rem(14.4),
    height: rem(14.4),
  },
});

const unmatchedRowsStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
});

const unmatchedRowStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(16),
});

const unmatchedTextStyles = css({
  fontSize: rem(17),
  lineHeight: rem(24),
  color: lead.rgb,
});

const unmatchedMetaStyles = css({
  color: lead.rgb,
});

const suggestionLinkStyles = css({
  color: fern.rgb,
});

const addSuggestionButtonStyles = css({
  flexGrow: 0,
  flexShrink: 0,
  alignItems: 'center',
  gap: rem(8),
  lineHeight: rem(24),
  color: lead.rgb,
  '> svg': {
    width: rem(24),
    height: rem(24),
    paddingTop: rem(2),
    paddingBottom: rem(2),
  },
  ...buttonIconGapReset,
});

const unmatchedHelpStyles = css({
  margin: 0,
  color: lead.rgb,
  fontSize: rem(14),
  fontWeight: 400,
  lineHeight: rem(24),
});

const getAllowedExtensions = (accept: string): string[] =>
  accept
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.startsWith('.'));

const hasAllowedExtension = (
  file: File,
  allowedExtensions: string[],
): boolean => {
  const name = file.name.toLowerCase();
  return allowedExtensions.some((extension) => name.endsWith(extension));
};

const suggestionToTeam = (
  suggestion: UploadListSuggestion,
): EventAttendanceTeam => ({
  teamId: suggestion.teamId,
  teamName: suggestion.teamName,
  attended: true,
  teamType: suggestion.teamType,
});

const UploadListModal: React.FC<UploadListModalProps> = ({
  onUploadList,
  onAddAttendees,
  onBack,
  maxFileSizeMb = defaultMaxFileSizeMb,
  accept = defaultAccept,
  initialFiles = [],
  initialResult = null,
  initialSectionsOpen = false,
}) => {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [result, setResult] = useState<UploadListResult | null>(initialResult);
  const [error, setError] = useState<string | null>(null);
  const [addedSuggestionIds, setAddedSuggestionIds] = useState<
    ReadonlySet<string>
  >(() => new Set());
  const [removedMatchedIds, setRemovedMatchedIds] = useState<
    ReadonlySet<string>
  >(() => new Set());
  const [matchedOpen, setMatchedOpen] = useState(initialSectionsOpen);
  const [unmatchedOpen, setUnmatchedOpen] = useState(initialSectionsOpen);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const uploadSeq = useRef(0);

  const allowedExtensions = getAllowedExtensions(accept);
  const maxBytes = maxFileSizeMb * 1000 * 1000;

  const runUpload = (nextFiles: File[]) => {
    setFiles(nextFiles);
    // A new file set invalidates the per-team edits made against the old result.
    setAddedSuggestionIds(new Set());
    setRemovedMatchedIds(new Set());
    // Bump the sequence first so any parse still in flight (e.g. the file was
    // removed before it resolved) can no longer write its result.
    const seq = uploadSeq.current + 1;
    uploadSeq.current = seq;
    if (nextFiles.length === 0) {
      setResult(null);
      setIsUploading(false);
      return;
    }
    void onUploadList(nextFiles)
      .then((uploadResult) => {
        if (seq === uploadSeq.current) {
          setResult(uploadResult);
          setIsUploading(false);
        }
      })
      .catch(() => {
        if (seq === uploadSeq.current) {
          setResult(null);
          setIsUploading(false);
        }
      });
  };

  const handleFilesSelected = (selected: File[]) => {
    const valid = selected.filter(
      (file) =>
        hasAllowedExtension(file, allowedExtensions) && file.size <= maxBytes,
    );
    const tooLarge = selected.some(
      (file) =>
        hasAllowedExtension(file, allowedExtensions) && file.size > maxBytes,
    );
    if (tooLarge) {
      setError(
        `The file size exceeds the limit of ${maxFileSizeMb} MB. Please upload a smaller file.`,
      );
    } else if (valid.length < selected.length) {
      setError('CSV or XLSX files only.');
    } else {
      setError(null);
    }
    if (valid.length > 0) {
      setIsUploading(true);
      runUpload([...files, ...valid]);
    }
  };

  const removeFile = (index: number) =>
    runUpload(files.filter((_, fileIndex) => fileIndex !== index));

  const promoteSuggestion = (teamId: string) =>
    setAddedSuggestionIds((prev) => new Set(prev).add(teamId));

  const removeMatchedTeam = (teamId: string) =>
    setRemovedMatchedIds((prev) => new Set(prev).add(teamId));

  const isPromoted = (
    team: UploadListUnmatchedTeam,
  ): team is UploadListUnmatchedTeam & { suggestion: UploadListSuggestion } =>
    !!team.suggestion && addedSuggestionIds.has(team.suggestion.teamId);

  const matchedTeams: EventAttendanceTeam[] = result
    ? [
        ...result.matched.filter((team) => !removedMatchedIds.has(team.teamId)),
        ...result.unmatched
          .filter(isPromoted)
          .map((team) => suggestionToTeam(team.suggestion)),
      ]
    : [];

  const remainingUnmatched = result
    ? result.unmatched.filter((team) => !isPromoted(team))
    : [];

  const totalTeams = result
    ? result.matched.length + result.alreadyInCount + result.unmatched.length
    : 0;

  const isDirty = files.length > 0 || matchedTeams.length > 0;
  const addEnabled = matchedTeams.length > 0 && !isSaving;

  const requestClose = () => {
    if (isDirty) {
      setIsCancelling(true);
    } else {
      onBack();
    }
  };

  const handleAddAttendees = async () => {
    setIsSaving(true);
    try {
      await onAddAttendees(matchedTeams, files);
    } catch {
      // The caller surfaces the error; the modal only needs to unlock so the
      // user can retry or cancel instead of staying stuck on "saving".
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal padding={false} overrideModalStyles={modalStyles}>
      <header css={headerStyles}>
        <div css={headerTitleStyles}>
          <Button
            small
            noMargin
            aria-label="Back"
            enabled={!isSaving}
            onClick={requestClose}
            overrideStyles={css([iconButtonStyles, headerIconStyles])}
          >
            {chevronLeftIcon}
          </Button>
          <Headline2 noMargin overrideStyles={titleStyles}>
            Upload a list
          </Headline2>
        </div>
        <Button
          small
          noMargin
          aria-label="Close"
          enabled={!isSaving}
          onClick={requestClose}
          overrideStyles={css([iconButtonStyles, headerIconStyles])}
        >
          {crossIcon}
        </Button>
      </header>

      <div css={bodyStyles}>
        <Paragraph noMargin accent="lead">
          Add teams from a list. Matched teams are added and marked attended.
          Teams already added are skipped. CSV or XLSX files only.
        </Paragraph>

        <section css={uploadSectionStyles}>
          {files.length > 0 && (
            <div css={chipsStyles}>
              {files.map((file, index) => (
                <Tag
                  key={`${file.name}-${index}`}
                  onRemove={() => removeFile(index)}
                >
                  {file.name}
                </Tag>
              ))}
            </div>
          )}
          <input
            ref={uploadInputRef}
            type="file"
            accept={accept}
            aria-label="Add a list"
            multiple
            hidden
            onChange={(event) => {
              const selected = Array.from(event.target.files ?? []);
              if (selected.length > 0) {
                handleFilesSelected(selected);
              }
              if (uploadInputRef.current) {
                uploadInputRef.current.value = '';
              }
            }}
          />
          <Button
            small
            primary
            noMargin
            enabled={!isUploading}
            loading={isUploading}
            overrideStyles={addButtonStyles}
            onClick={() => uploadInputRef.current?.click()}
          >
            {!isUploading && plusIcon}
            Add
          </Button>
          {error && (
            <p css={errorStyles} role="alert">
              {error}
            </p>
          )}
        </section>

        {result && (
          <div css={resultStyles}>
            <div css={summaryStyles}>
              <span css={summaryStrongStyles}>{totalTeams} Teams</span>
              <span css={summarySeparatorStyles}>•</span>
              <span>{result.matched.length} matched</span>
              <span css={summarySeparatorStyles}>•</span>
              <span>{result.alreadyInCount} already in</span>
            </div>

            <div css={resultCardStyles}>
              {matchedTeams.length > 0 && (
                <>
                  <button
                    type="button"
                    css={sectionHeaderStyles}
                    aria-expanded={matchedOpen}
                    onClick={() => setMatchedOpen((open) => !open)}
                  >
                    <span css={[sectionHeaderLabelStyles, matchedLabelStyles]}>
                      {tickSmallIcon}
                      <span>
                        <strong>{matchedTeams.length} teams</strong> will be
                        added and marked if attended
                      </span>
                    </span>
                    <span css={chevronStyles(matchedOpen)}>
                      {chevronDownIcon}
                    </span>
                  </button>
                  {matchedOpen && (
                    <div css={sectionBodyStyles}>
                      {matchedTeams.map((team) => (
                        <div key={team.teamId} css={matchedRowStyles}>
                          <span css={matchedTeamStyles}>
                            {teamIcon(team.teamType)}
                            <Link
                              href={
                                network({})
                                  .teams({})
                                  .team({ teamId: team.teamId }).$
                              }
                            >
                              <span css={matchedTeamNameStyles}>
                                {team.teamName}
                              </span>
                            </Link>
                          </span>
                          <Button
                            noMargin
                            aria-label={`Remove ${team.teamName}`}
                            onClick={() => removeMatchedTeam(team.teamId)}
                            overrideStyles={deleteButtonStyles}
                          >
                            {binIcon}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {matchedTeams.length > 0 && remainingUnmatched.length > 0 && (
                <div css={dividerStyles} />
              )}

              {remainingUnmatched.length > 0 && (
                <>
                  <button
                    type="button"
                    css={sectionHeaderStyles}
                    aria-expanded={unmatchedOpen}
                    onClick={() => setUnmatchedOpen((open) => !open)}
                  >
                    <span
                      css={[sectionHeaderLabelStyles, notMatchedLabelStyles]}
                    >
                      {crossSmallIcon}
                      <span>
                        <strong>{remainingUnmatched.length} not matched</strong>{' '}
                        • will not be added
                      </span>
                    </span>
                    <span css={chevronStyles(unmatchedOpen)}>
                      {chevronDownIcon}
                    </span>
                  </button>
                  {unmatchedOpen && (
                    <div css={sectionBodyStyles}>
                      <div css={unmatchedRowsStyles}>
                        {remainingUnmatched.map((team) => {
                          const { suggestion } = team;
                          return (
                            <div key={team.name} css={unmatchedRowStyles}>
                              <span css={unmatchedTextStyles}>
                                “{team.name}”{' '}
                                {suggestion ? (
                                  <span css={unmatchedMetaStyles}>
                                    • did you mean{' '}
                                    <Link
                                      href={
                                        network({}).teams({}).team({
                                          teamId: suggestion.teamId,
                                        }).$
                                      }
                                    >
                                      <span css={suggestionLinkStyles}>
                                        {suggestion.teamName}
                                      </span>
                                    </Link>
                                    ?
                                  </span>
                                ) : (
                                  <span css={unmatchedMetaStyles}>
                                    • no close match
                                  </span>
                                )}
                              </span>
                              {suggestion && (
                                <Button
                                  small
                                  noMargin
                                  overrideStyles={addSuggestionButtonStyles}
                                  onClick={() =>
                                    promoteSuggestion(suggestion.teamId)
                                  }
                                >
                                  {plusIcon}
                                  Add
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p css={unmatchedHelpStyles}>
                        Add a suggested team to include it, or fix the name in
                        your file and upload again.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmableModalFooter
        isConfirming={isCancelling}
        confirmationMessage="You'll lose all unsaved changes if you cancel now."
        onKeepEditing={() => setIsCancelling(false)}
        onDiscard={onBack}
        onCancel={requestClose}
        cancelEnabled={!isSaving}
        confirmLabel="Add Attendees"
        onConfirm={() => {
          void handleAddAttendees();
        }}
        confirmEnabled={addEnabled}
        confirmLoading={isSaving}
      />
    </Modal>
  );
};

export default UploadListModal;
