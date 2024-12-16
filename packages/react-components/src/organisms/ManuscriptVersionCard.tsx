import {
  ManuscriptLifecycle,
  ManuscriptVersion,
  Message,
  quickCheckQuestions,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps, Suspense, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  article,
  AssociationList,
  Button,
  Caption,
  Divider,
  ExpandableText,
  formatDate,
  formatDateAndWeekday,
  lead,
  Link,
  Loading,
  minusRectIcon,
  Pill,
  PencilIcon,
  plusRectIcon,
  QuickCheckReplyModal,
  Subtitle,
  colors,
} from '..';
import { paddingStyles } from '../card';
import { Discussion } from '../molecules';
import ManuscriptFileSection from '../molecules/ManuscriptFileSection';
import UserTeamInfo from '../molecules/UserTeamInfo';
import { mobileScreen, perRem, rem } from '../pixels';
import ComplianceReportCard from './ComplianceReportCard';

type ManuscriptVersionCardProps = {
  version: ManuscriptVersion;
  grantId: string;
  teamId: string;
  teamIdCode: string;
  manuscriptCount: number;
  manuscriptId: string;
  isTeamMember: boolean;
  canEditManuscript: boolean;
  isActiveManuscript: boolean;
} & Pick<ComponentProps<typeof QuickCheckReplyModal>, 'onReplyToDiscussion'> &
  Pick<ComponentProps<typeof Discussion>, 'getDiscussion'>;

const toastStyles = css({
  padding: `${15 / perRem}em ${24 / perRem}em`,
  borderRadius: `${rem(8)} ${rem(8)} 0 0`,
});

const iconStyles = css({
  display: 'inline-block',
  width: rem(24),
  height: rem(24),
  paddingRight: rem(12),
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

const titleContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: rem(16),

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: rem(8),
  },
});

const editIconStyles = css({
  width: 'min-content',
  minWidth: 'min-content',
  flexGrow: 0,
  height: 'min-content',
});

const fileDividerStyles = css({
  display: 'block',
  margin: `${rem(4)} 0`,
});

const dividerStyles = css({
  display: 'block',
  margin: `${rem(21)} 0`,
});

const quickCheckStyles = css({
  marginTop: rem(16),
  gap: rem(12),
  display: 'flex',
  flexDirection: 'column',
});

const additionalInformationListStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `${rem(6)} 0`,
});
const additionalInformationEntryStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: rem(24),
  padding: `${rem(8)} 0`,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
  },
});
const additionalInformationValueStyles = css({
  textAlign: 'right',
  color: lead.rgb,
  overflowWrap: 'anywhere',

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    marginTop: `${rem(12)}`,
    textAlign: 'inherit',
  },
});
const userContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: rem(8),
  paddingTop: rem(32),
});

const updatedByAndEditContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  gap: rem(16),

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
  },
});

const updatedByContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
});

const updatedByTextStyles = css({
  display: 'inline-flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  alignSelf: 'flex-end',
  gap: rem(2),

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
});

const hasAdditionalInfo = (version: ManuscriptVersion) =>
  version.preprintDoi ||
  version.publicationDoi ||
  version.requestingApcCoverage ||
  version.otherDetails;

export const getLifecycleCode = ({
  lifecycle,
}: {
  lifecycle: ManuscriptLifecycle;
}) => {
  switch (lifecycle) {
    case 'Draft Manuscript (prior to Publication)':
      return 'G';
    case 'Preprint':
      return 'P';
    case 'Publication':
      return 'D';
    case 'Publication with addendum or corrigendum':
      return 'C';
    case 'Typeset proof':
      return 'T';
    case 'Other':
    default:
      return 'O';
  }
};

export const getManuscriptVersionUID = ({
  version,
  teamIdCode,
  grantId,
  manuscriptCount,
  manuscriptVersionCount,
}: {
  version: Pick<ManuscriptVersion, 'type' | 'lifecycle'>;
  teamIdCode: string;
  grantId: string;
  manuscriptCount: number;
  manuscriptVersionCount: number;
}) => {
  const manuscriptTypeCode =
    version.type === 'Original Research' ? 'org' : 'rev';

  const lifecycleCode = getLifecycleCode(version);
  return `${teamIdCode}-${grantId}-${String(manuscriptCount).padStart(
    3,
    '0',
  )}-${manuscriptTypeCode}-${lifecycleCode}-${manuscriptVersionCount}`;
};

export const getUserHref = (id: string) =>
  network({}).users({}).user({ userId: id }).$;

export const getTeams = (teams: Message['createdBy']['teams']) =>
  teams.map((team) => ({
    href: network({}).teams({}).team({ teamId: team.id }).$,
    name: team.name,
  }));

const ManuscriptVersionCard: React.FC<ManuscriptVersionCardProps> = ({
  version,
  teamId,
  teamIdCode,
  grantId,
  manuscriptCount,
  onReplyToDiscussion,
  getDiscussion,
  manuscriptId,
  isTeamMember,
  isActiveManuscript,
  canEditManuscript,
}) => {
  const history = useHistory();

  const [expanded, setExpanded] = useState(false);

  const quickCheckDetails = quickCheckQuestions.filter(
    ({ field }) => version[`${field}Details`]?.message?.text?.length,
  );

  const getUpdatedByData = () => {
    if (
      version.updatedBy &&
      version.updatedBy.id &&
      version.updatedBy.teams &&
      version.updatedBy.teams.length
    ) {
      return {
        displayName: version.updatedBy.displayName,
        userHref: getUserHref(version.updatedBy.id),
        teams: getTeams(version.updatedBy.teams),
      };
    }
    return {
      displayName: version.createdBy.displayName,
      userHref: getUserHref(version.createdBy.id),
      teams: getTeams(version.createdBy.teams),
    };
  };

  const updatedByData = getUpdatedByData();

  const editManuscriptRoute = network({})
    .teams({})
    .team({ teamId })
    .workspace({})
    .editManuscript({ manuscriptId }).$;

  const handleEditManuscript = () => {
    if (editManuscriptRoute) {
      history.push(editManuscriptRoute);
    }
  };
  return (
    <>
      <div css={{ borderBottom: `1px solid ${colors.steel.rgb}` }}>
        {version.complianceReport && (
          <ComplianceReportCard {...version.complianceReport} />
        )}
        <div css={toastStyles}>
          <span css={toastHeaderStyles}>
            <span css={iconStyles}>
              <Button
                aria-label={expanded ? 'Collapse Version' : 'Expand Version'}
                linkStyle
                onClick={() => setExpanded(!expanded)}
              >
                <span>{expanded ? minusRectIcon : plusRectIcon}</span>
              </Button>
            </span>
            <span css={iconStyles}>{article}</span>
            <div css={titleContainerStyles}>
              <Subtitle noMargin>Manuscript #{version.count}</Subtitle>

              <div css={updatedByAndEditContainerStyles}>
                <Caption accent="lead" noMargin>
                  <div css={updatedByContainerStyles}>
                    <span css={updatedByTextStyles}>
                      Last Updated:
                      <span>{formatDate(new Date(version.publishedAt))}</span>
                    </span>
                    <span css={updatedByTextStyles}>
                      Updated by:
                      <UserTeamInfo
                        displayName={updatedByData.displayName}
                        userHref={updatedByData.userHref}
                        teams={updatedByData.teams}
                      />
                    </span>
                  </div>
                </Caption>
                {isActiveManuscript && canEditManuscript && (
                  <Button
                    aria-label="Edit"
                    small
                    noMargin
                    onClick={handleEditManuscript}
                    overrideStyles={editIconStyles}
                  >
                    <PencilIcon />
                  </Button>
                )}
              </div>
            </div>
          </span>
          <div
            style={{
              display: 'flex',
              gap: rem(10),
              marginTop: rem(15),
              paddingLeft: rem(40),
            }}
          >
            <Pill accent="gray">{version.type}</Pill>
            <Pill accent="gray">{version.lifecycle}</Pill>
            <Pill accent="blue">
              {getManuscriptVersionUID({
                version,
                teamIdCode,
                grantId,
                manuscriptCount,
                manuscriptVersionCount: version.count,
              })}
            </Pill>
          </div>
        </div>

        {expanded && (
          <div>
            <div css={[paddingStyles, toastContentStyles]}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: rem(12),
                  marginTop: rem(2),
                  marginBottom: rem(16),
                }}
              >
                <AssociationList
                  type="Team"
                  inline
                  associations={version.teams}
                />
                <AssociationList
                  type="Lab"
                  inline
                  associations={version.labs.map(({ name, id }) => ({
                    displayName: name,
                    id,
                  }))}
                />
              </div>
              <ExpandableText>{version.description}</ExpandableText>
              <div>
                <ManuscriptFileSection
                  filename={version.manuscriptFile.filename}
                  url={version.manuscriptFile.url}
                />
                {version.keyResourceTable && (
                  <ManuscriptFileSection
                    filename={version.keyResourceTable.filename}
                    url={version.keyResourceTable.url}
                  />
                )}
                {version.additionalFiles &&
                  version.additionalFiles.length > 0 &&
                  version.additionalFiles.map((additionalFile) => (
                    <ManuscriptFileSection
                      filename={additionalFile.filename}
                      url={additionalFile.url}
                      key={additionalFile.id}
                    />
                  ))}
                {quickCheckDetails.length > 0 && (
                  <span css={fileDividerStyles}>
                    <Divider />
                  </span>
                )}
              </div>
              {quickCheckDetails.map(({ field, question }) => {
                const discussion = version[`${field}Details`];
                return (
                  discussion !== undefined && (
                    <div css={quickCheckStyles} key={field}>
                      <Subtitle>{question}</Subtitle>
                      <Suspense fallback={<Loading />}>
                        <Discussion
                          canReply={isActiveManuscript && isTeamMember}
                          id={discussion.id}
                          getDiscussion={getDiscussion}
                          onReplyToDiscussion={onReplyToDiscussion}
                          key={discussion.id}
                        />
                      </Suspense>
                    </div>
                  )
                );
              })}
              {hasAdditionalInfo(version) && (
                <div>
                  <span
                    css={
                      quickCheckDetails.length
                        ? dividerStyles
                        : fileDividerStyles
                    }
                  >
                    <Divider />
                  </span>
                  <span
                    css={{
                      fontStyle: 'italic',
                      marginBottom: rem(12),
                      display: 'block',
                    }}
                  >
                    <Subtitle>Additional Information</Subtitle>
                  </span>

                  <ol css={additionalInformationListStyles}>
                    {version.preprintDoi && (
                      <li css={additionalInformationEntryStyles}>
                        <strong>Preprint DOI</strong>
                        <span css={additionalInformationValueStyles}>
                          <Link
                            href={new URL(
                              `https://doi.org/${version.preprintDoi}`,
                            ).toString()}
                          >
                            {version.preprintDoi}
                          </Link>
                        </span>
                      </li>
                    )}

                    {version.publicationDoi && (
                      <>
                        {version.preprintDoi && <Divider />}
                        <li css={additionalInformationEntryStyles}>
                          <strong>Publication DOI</strong>
                          <span css={additionalInformationValueStyles}>
                            <Link
                              href={new URL(
                                `https://doi.org/${version.publicationDoi}`,
                              ).toString()}
                            >
                              {version.publicationDoi}
                            </Link>
                          </span>
                        </li>
                      </>
                    )}
                    {version.requestingApcCoverage && (
                      <>
                        {(version.preprintDoi || version.publicationDoi) && (
                          <Divider />
                        )}
                        <li css={additionalInformationEntryStyles}>
                          <strong>Requested APC Coverage?</strong>
                          <span css={additionalInformationValueStyles}>
                            {version.requestingApcCoverage}
                          </span>
                        </li>
                        {version?.submitterName ? (
                          <li css={additionalInformationEntryStyles}>
                            <strong>Submitter's Name</strong>
                            <span css={additionalInformationValueStyles}>
                              {version.submitterName}
                            </span>
                          </li>
                        ) : null}
                        {version?.submissionDate ? (
                          <li css={additionalInformationEntryStyles}>
                            <strong>Submission Date</strong>
                            <span css={additionalInformationValueStyles}>
                              {formatDateAndWeekday(
                                new Date(version.submissionDate),
                              )}
                            </span>
                          </li>
                        ) : null}
                      </>
                    )}
                    {version.otherDetails && (
                      <>
                        {(version.preprintDoi ||
                          version.publicationDoi ||
                          version.requestingApcCoverage) && <Divider />}
                        <li css={additionalInformationEntryStyles}>
                          <strong>Other details</strong>
                          <span css={additionalInformationValueStyles}>
                            {version.otherDetails}
                          </span>
                        </li>
                      </>
                    )}
                  </ol>
                </div>
              )}
              <Caption accent="lead" noMargin>
                <div css={userContainerStyles}>
                  Date created:
                  <span>{formatDate(new Date(version.createdDate))}</span>
                  <span> · </span>
                  Created by:
                  <UserTeamInfo
                    displayName={version.createdBy.displayName}
                    userHref={getUserHref(version.createdBy.id)}
                    teams={getTeams(version.createdBy.teams)}
                  />
                </div>
              </Caption>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManuscriptVersionCard;
