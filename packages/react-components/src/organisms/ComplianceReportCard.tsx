import {
  ComplianceReportResponse,
  DiscussionRequest,
  DiscussionDataObject,
  ManuscriptVersion,
  ComplianceReportDataObject,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { memo, Suspense, useEffect, useRef, useState } from 'react';
import {
  Button,
  minusRectIcon,
  plusRectIcon,
  Subtitle,
  Link,
  crnReportIcon,
  colors,
  ExternalLinkIcon,
  Markdown,
  ExpandableText,
  Caption,
  formatDate,
  Loading,
  replyIcon,
  Divider,
  DiscussionModal,
} from '..';
import { paddingStyles } from '../card';
import { Discussion } from '../molecules';
import UserTeamInfo from '../molecules/UserTeamInfo';
import { mobileScreen, perRem, rem } from '../pixels';
import { getTeams, getUserHref } from './ManuscriptVersionCard';

type ComplianceReportCardProps = ComplianceReportResponse & {
  createComplianceDiscussion: (
    complianceReportId: string,
    message: string,
  ) => Promise<string>;
  getDiscussion: (id: string) => DiscussionDataObject | undefined;
  onSave: (id: string, data: DiscussionRequest) => Promise<void>;
  setVersion: (
    callback: (prev: ManuscriptVersion) => ManuscriptVersion,
  ) => void;
  onEndDiscussion: (id: string) => Promise<void>;
  isComplianceReviewer?: boolean;
};

const toastStyles = css({
  padding: `${15 / perRem}em ${24 / perRem}em`,
  borderRadius: `${rem(8)} ${rem(8)} 0 0`,
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${12 / perRem}em`,
});

const toastHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    alignItems: 'flex-start',
  },
});

const toastContentStyles = css({
  paddingLeft: `${60 / perRem}em`,
  paddingTop: rem(15),
});

const externalIconStyle = css({
  display: 'flex',
  alignSelf: 'center',
  gap: rem(8),
  paddingRight: rem(8),
  textWrap: 'nowrap',
});

const buttonStyles = css({
  width: rem(151),
  '> a': {
    height: rem(40),
  },
});

const userContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: rem(8),
  paddingTop: rem(32),
});

const buttonsWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
});

const startDiscussionButtonStyles = css({
  width: 'fit-content',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: 'fit-content',
  height: rem(40),
});

const ComplianceReportCard: React.FC<ComplianceReportCardProps> = ({
  id,
  url,
  description,
  count,
  createdBy,
  createdDate,
  discussionId,
  manuscriptId,
  versionId,
  isComplianceReviewer,
  createComplianceDiscussion,
  getDiscussion,
  onSave,
  setVersion,
  onEndDiscussion,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [startDiscussion, setStartDiscussion] = useState(false);
  const startedDiscussionIdRef = useRef<string>('');
  const discussion = getDiscussion(
    discussionId || startedDiscussionIdRef.current,
  );

  useEffect(
    () => () => {
      if (startedDiscussionIdRef.current) {
        setVersion((prev) => ({
          ...prev,
          complianceReport: {
            ...(prev.complianceReport as ComplianceReportDataObject),
            discussionId: startedDiscussionIdRef.current,
          },
        }));
      }
    },
    [setVersion],
  );

  return (
    <div css={{ borderBottom: `1px solid ${colors.steel.rgb}` }}>
      <div css={toastStyles}>
        <span css={toastHeaderStyles}>
          <span css={[iconStyles]}>
            <Button
              aria-label={expanded ? 'Collapse Report' : 'Expand Report'}
              linkStyle
              onClick={() => setExpanded(!expanded)}
            >
              <span>{expanded ? minusRectIcon : plusRectIcon}</span>
            </Button>
          </span>
          <span css={[iconStyles]}>{crnReportIcon}</span>
          <Subtitle noMargin>Compliance Report #{count}</Subtitle>
        </span>
      </div>
      {expanded && (
        <div>
          <div css={[paddingStyles, toastContentStyles]}>
            <ExpandableText>
              <Markdown value={description}></Markdown>
            </ExpandableText>
            <div css={buttonsWrapperStyles}>
              <div css={buttonStyles}>
                <Link buttonStyle fullWidth small primary href={url}>
                  <span css={externalIconStyle}>
                    <ExternalLinkIcon /> View Report
                  </span>
                </Link>
              </div>

              {!discussionId && !startedDiscussionIdRef.current && (
                <>
                  <Button
                    noMargin
                    small
                    onClick={() => setStartDiscussion(true)}
                    overrideStyles={startDiscussionButtonStyles}
                  >
                    <span
                      css={{
                        display: 'flex',
                        gap: rem(8),
                        margin: `0 ${rem(8)} 0 0`,
                      }}
                    >
                      {replyIcon} Start Discussion
                    </span>
                  </Button>
                  {startDiscussion && id && (
                    <DiscussionModal
                      discussionId={id}
                      title="Start Discussion"
                      editorLabel="Please provide reasons why the compliance report isn’t correct"
                      ruleMessage="Message cannot exceed 256 characters."
                      onDismiss={() => setStartDiscussion(false)}
                      onSave={async (
                        complianceReportId: string,
                        data: DiscussionRequest,
                      ) => {
                        if (!manuscriptId || !versionId) return;
                        const createdDiscussionId =
                          await createComplianceDiscussion(
                            complianceReportId,
                            data.text,
                          );
                        startedDiscussionIdRef.current = createdDiscussionId;
                      }}
                    />
                  )}
                </>
              )}
            </div>
            {(discussionId || startedDiscussionIdRef.current) && (
              <>
                <Divider />
                <Subtitle>
                  {discussion?.endedAt
                    ? 'Discussion Ended'
                    : 'Discussion Started'}
                </Subtitle>
                <Suspense fallback={<Loading />}>
                  <Discussion
                    canReply
                    canEndDiscussion={isComplianceReviewer}
                    onEndDiscussion={onEndDiscussion}
                    modalTitle="Reply to compliance report discussion"
                    id={
                      (discussionId ?? startedDiscussionIdRef.current) as string
                    }
                    getDiscussion={getDiscussion}
                    onSave={onSave}
                    key={discussionId}
                  />
                </Suspense>
              </>
            )}
            <Caption accent="lead" noMargin>
              <div css={userContainerStyles}>
                Date added:
                <span>{formatDate(new Date(createdDate))}</span>
                <span> · </span>
                Submitted by:
                <UserTeamInfo
                  displayName={createdBy.displayName}
                  userHref={getUserHref(createdBy.id)}
                  teams={getTeams(createdBy.teams)}
                />
              </div>
            </Caption>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ComplianceReportCard, (prevProps, props) => {
  if (!prevProps) return true;
  const {
    createComplianceDiscussion: _createComplianceDiscussion,
    getDiscussion: _getDiscussion,
    onSave: _onSave,
    setVersion: _setVersion,
    ...restPrevProps
  } = prevProps;

  const {
    createComplianceDiscussion: _createComplianceDiscussionNew,
    getDiscussion: _getDiscussionNew,
    onSave: _onSaveNew,
    setVersion: _setVersionNew,
    ...restProps
  } = props;

  return JSON.stringify(restPrevProps) === JSON.stringify(restProps);
});
