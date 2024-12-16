import {
  ComplianceReportResponse,
  DiscussionDataObject,
  DiscussionPatchRequest,
  ManuscriptVersion,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { Suspense, useEffect, useRef, useState } from 'react';
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
} from '..';
import { paddingStyles } from '../card';
import { Discussion } from '../molecules';
import UserTeamInfo from '../molecules/UserTeamInfo';
import { mobileScreen, perRem, rem } from '../pixels';
import { getTeams, getUserHref } from './ManuscriptVersionCard';
import StartComplianceDiscussion from './StartComplianceDiscussion';

type ComplianceReportCardProps = ComplianceReportResponse & {
  createComplianceDiscussion: (
    complianceReportId: string,
    message: string,
    manuscriptId: string,
    versionId: string,
  ) => Promise<string>;
  getDiscussion: (id: string) => DiscussionDataObject | undefined;
  onReplyToDiscussion: (
    id: string,
    patch: DiscussionPatchRequest,
  ) => Promise<void>;
  setVersion: (
    callback: (prev: ManuscriptVersion) => ManuscriptVersion,
  ) => void;
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
  createComplianceDiscussion,
  getDiscussion,
  onReplyToDiscussion,
  setVersion,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [startDiscussion, setStartDiscussion] = useState(false);

  const startedDiscussionIdRef = useRef<string | undefined>(undefined);

  useEffect(
    () => () => {
      if (startedDiscussionIdRef.current) {
        setVersion((prev) => ({
          ...prev,
          complianceReport: prev.complianceReport
            ? {
                ...prev.complianceReport,
                discussionId: startedDiscussionIdRef.current ?? '',
              }
            : undefined,
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
            <Button linkStyle onClick={() => setExpanded(!expanded)}>
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
            <div css={buttonStyles}>
              <Link buttonStyle fullWidth small primary href={url}>
                <span css={externalIconStyle}>
                  <ExternalLinkIcon /> View Report
                </span>
              </Link>
            </div>
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

            {!discussionId && !startedDiscussionIdRef.current && (
              <>
                <Button noMargin small onClick={() => setStartDiscussion(true)}>
                  <span
                    css={{
                      display: 'inline-flex',
                      gap: rem(8),
                      margin: `0 ${rem(8)} 0 0`,
                    }}
                  >
                    {replyIcon} Start a discussion
                  </span>
                </Button>
                {startDiscussion && id && (
                  <StartComplianceDiscussion
                    complianceReportId={id}
                    onDismiss={() => setStartDiscussion(false)}
                    onSave={async (
                      complianceReportId: string,
                      message: string,
                    ) => {
                      if (!manuscriptId || !versionId) return;
                      const createdDiscussionId =
                        await createComplianceDiscussion(
                          complianceReportId,
                          message,
                          manuscriptId,
                          versionId,
                        );
                      startedDiscussionIdRef.current = createdDiscussionId;
                    }}
                  />
                )}
              </>
            )}
            {(discussionId || startedDiscussionIdRef.current) && (
              <Suspense fallback={<Loading />}>
                <Discussion
                  canReply
                  id={
                    (discussionId ?? startedDiscussionIdRef.current) as string
                  }
                  getDiscussion={getDiscussion}
                  onReplyToDiscussion={onReplyToDiscussion}
                  key={discussionId}
                />
              </Suspense>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceReportCard;
