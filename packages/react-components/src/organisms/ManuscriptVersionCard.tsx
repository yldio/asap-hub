import { ManuscriptVersion, quickCheckQuestions } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';
import {
  Button,
  minusRectIcon,
  Pill,
  plusRectIcon,
  Subtitle,
  article,
  Divider,
  Link,
  lead,
  AssociationList,
  formatDate,
  Caption,
} from '..';
import { paddingStyles } from '../card';
import { UserCommentHeader } from '../molecules';
import { mobileScreen, perRem, rem } from '../pixels';
import ManuscriptFileSection from '../molecules/ManuscriptFileSection';
import UserTeamInfo from '../molecules/UserTeamInfo';

type ManuscriptVersionCardProps = ManuscriptVersion;

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

const hasAdditionalInfo = (version: ManuscriptVersion) =>
  version.preprintDoi ||
  version.publicationDoi ||
  version.requestingApcCoverage ||
  version.otherDetails;

const ManuscriptVersionCard: React.FC<ManuscriptVersionCardProps> = (
  version,
) => {
  const [expanded, setExpanded] = useState(false);

  const quickCheckDetails = quickCheckQuestions.filter(
    ({ field }) => version[`${field}Details`]?.length,
  );
  const userHref =
    version.createdBy.id &&
    network({}).users({}).user({ userId: version.createdBy.id }).$;
  const teams = version.createdBy.teams.map((team) => ({
    href: network({}).teams({}).team({ teamId: team.id }).$,
    name: team.name,
  }));

  return (
    <div>
      <div css={toastStyles}>
        <span css={toastHeaderStyles}>
          <span css={[iconStyles]}>
            <Button linkStyle onClick={() => setExpanded(!expanded)}>
              <span>{expanded ? minusRectIcon : plusRectIcon}</span>
            </Button>
          </span>
          <span css={[iconStyles]}>{article}</span>
          <Subtitle noMargin>Manuscript</Subtitle>
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
            {quickCheckDetails.map(({ field, question }) => (
              <div css={quickCheckStyles} key={field}>
                <Subtitle>{question}</Subtitle>
                <UserCommentHeader
                  {...version.createdBy}
                  userHref={userHref}
                  teams={teams}
                  date={version.publishedAt}
                />
                <span>{version[`${field}Details`]}</span>
              </div>
            ))}
            {hasAdditionalInfo(version) && (
              <div>
                <span
                  css={
                    /* istanbul ignore next */
                    quickCheckDetails.length ? dividerStyles : fileDividerStyles
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
                        <strong>Requesting APC Coverage?</strong>
                        <span css={additionalInformationValueStyles}>
                          {version.requestingApcCoverage}
                        </span>
                      </li>
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
                Date added:
                <span>{formatDate(new Date(version.createdDate))}</span>
                <span> · </span>
                Submitted by:
                <UserTeamInfo
                  displayName={version.createdBy.displayName}
                  userHref={userHref}
                  teams={teams}
                />
              </div>
            </Caption>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManuscriptVersionCard;
