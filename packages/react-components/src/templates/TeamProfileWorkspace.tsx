import { isEnabled } from '@asap-hub/flags';
import { ManuscriptVersion, TeamResponse, TeamTool } from '@asap-hub/model';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Button,
  Caption,
  Card,
  Display,
  Headline2,
  Link,
  Paragraph,
  Subtitle,
} from '../atoms';
import { formatDateAndTime } from '../date';
import { plusIcon } from '../icons';
import { createMailTo, mailToSupport } from '../mail';
import { EligibilityModal, ToolCard } from '../organisms';
import ManuscriptCard from '../organisms/ManuscriptCard';
import { mobileScreen, perRem, rem } from '../pixels';

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});
const newToolStyles = css({
  gridArea: 'contact',
  display: 'flex',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'block',
  },
});

const complianceContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
});

const complianceHeaderStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const manuscriptButtonStyles = css({
  flexGrow: 0,
  alignSelf: 'center',
  gap: rem(8),
});

const toolContainerStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `${24 / perRem}em 0`,

  display: 'grid',
  gridRowGap: `${24 / perRem}em`,
});

const complianceCardContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
});

const manuscriptsGroupStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
});

const teamMemberCopy = {
  manuscriptSubmissions:
    'The following manuscripts were submitted by your team for compliance review.',
  manuscriptCollaborations:
    'The following manuscripts were submitted by another team for compliance review. Your team has been listed as a contributor to the manuscript.',
  noManuscriptSubmissions:
    'Your team has not submitted a manuscript for compliance review.',
  noManuscriptCollaborations:
    'Your team has not been listed as a contributor on manuscripts that were submitted for compliance review by other teams.',
};

const hubStaffCopy = {
  manuscriptSubmissions:
    'The following manuscripts were submitted by this team for compliance review.',
  manuscriptCollaborations:
    'The following manuscripts were submitted by another team for compliance review. This team has been listed as a contributor to the manuscript.',
  noManuscriptSubmissions:
    'This team has not submitted a manuscript for compliance review.',
  noManuscriptCollaborations:
    'This team has not been listed as a contributor on manuscripts that were submitted for compliance review by other teams.',
};

type TeamProfileWorkspaceProps = Readonly<
  Pick<
    TeamResponse,
    | 'id'
    | 'inactiveSince'
    | 'pointOfContact'
    | 'lastModifiedDate'
    | 'manuscripts'
    | 'collaborationManuscripts'
    | 'teamId'
    | 'grantId'
  >
> &
  Pick<
    ComponentProps<typeof ManuscriptCard>,
    'onUpdateManuscript' | 'isComplianceReviewer'
  > &
  Pick<
    ComponentProps<typeof ManuscriptCard>,
    'onSave' | 'isComplianceReviewer' | 'getDiscussion'
  > & {
    readonly tools: ReadonlyArray<TeamTool>;
    readonly onDeleteTool?: (toolIndex: number) => Promise<void>;
    readonly setEligibilityReasons: (newEligibilityReason: Set<string>) => void;
    readonly isTeamMember: boolean;
    readonly createComplianceDiscussion: (
      complianceReportId: string,
      message: string,
    ) => Promise<string>;
    readonly useVersionById: (args: {
      teamId: string;
      manuscriptId: string;
      versionId: string;
    }) => [
      ManuscriptVersion | undefined,
      (callback: (prev: ManuscriptVersion) => ManuscriptVersion) => void,
    ];
    readonly onEndDiscussion: (id: string) => Promise<void>;
  };

const TeamProfileWorkspace: React.FC<TeamProfileWorkspaceProps> = ({
  id,
  inactiveSince,
  teamId,
  grantId,
  onUpdateManuscript,
  pointOfContact,
  lastModifiedDate,
  manuscripts,
  collaborationManuscripts,
  tools,
  onDeleteTool,
  onSave,
  getDiscussion,
  setEligibilityReasons,
  isComplianceReviewer = false,
  isTeamMember,
  createComplianceDiscussion,
  useVersionById,
  onEndDiscussion,
}) => {
  const [displayEligibilityModal, setDisplayEligibilityModal] = useState(false);
  const history = useHistory();
  const user = useCurrentUserCRN();

  const {
    manuscriptSubmissions,
    manuscriptCollaborations,
    noManuscriptSubmissions,
    noManuscriptCollaborations,
  } = isTeamMember ? teamMemberCopy : hubStaffCopy;

  const toolsRoute = network({})
    .teams({})
    .team({ teamId: id })
    .workspace({})
    .tools({});

  const manuscriptRoute = network({})
    .teams({})
    .team({ teamId: id })
    .workspace({})
    .createManuscript({}).$;

  const handleShareManuscript = () => {
    setDisplayEligibilityModal(true);
  };

  const handleGoToManuscriptForm = () => {
    history.push(manuscriptRoute);
  };

  return (
    <div css={containerStyles}>
      {isEnabled('DISPLAY_MANUSCRIPTS') && (
        <>
          {displayEligibilityModal && (
            <EligibilityModal
              onDismiss={() => setDisplayEligibilityModal(false)}
              onGoToManuscriptForm={handleGoToManuscriptForm}
              setEligibilityReasons={setEligibilityReasons}
            />
          )}
          <Card overrideStyles={complianceCardContainerStyles}>
            <div css={complianceContainerStyles}>
              <div css={complianceHeaderStyles}>
                <Display styleAsHeading={3}>Compliance Review</Display>
                {!inactiveSince && isTeamMember && (
                  <div css={css(manuscriptButtonStyles)}>
                    <Button
                      onClick={handleShareManuscript}
                      primary
                      noMargin
                      small
                    >
                      {plusIcon} Submit Manuscript
                    </Button>
                  </div>
                )}
              </div>
              <Paragraph noMargin accent="lead">
                This directory contains all manuscripts with their compliance
                reports.
              </Paragraph>
            </div>
            <div data-testid="team-manuscripts" css={manuscriptsGroupStyles}>
              <Subtitle noMargin>Team Submission</Subtitle>
              {manuscripts.length ? (
                <>
                  <Paragraph noMargin accent="lead">
                    {manuscriptSubmissions}
                  </Paragraph>
                  <div>
                    {manuscripts.map((manuscript) => (
                      <div key={manuscript.id}>
                        <ManuscriptCard
                          {...manuscript}
                          user={user}
                          teamId={id}
                          teamIdCode={manuscript.teamId}
                          grantId={manuscript.grantId}
                          isComplianceReviewer={isComplianceReviewer}
                          isTeamMember={isTeamMember}
                          onUpdateManuscript={onUpdateManuscript}
                          onSave={onSave}
                          getDiscussion={getDiscussion}
                          isActiveTeam={!inactiveSince}
                          createComplianceDiscussion={
                            createComplianceDiscussion
                          }
                          useVersionById={useVersionById}
                          onEndDiscussion={onEndDiscussion}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Paragraph noMargin accent="lead">
                  {noManuscriptSubmissions}
                </Paragraph>
              )}
            </div>
            <div
              data-testid="collaboration-manuscripts"
              css={manuscriptsGroupStyles}
            >
              <Subtitle noMargin>Collaborator Submission</Subtitle>
              {collaborationManuscripts?.length ? (
                <>
                  <Paragraph noMargin accent="lead">
                    {manuscriptCollaborations}
                  </Paragraph>
                  <div>
                    {collaborationManuscripts?.map((manuscript) => (
                      <div key={manuscript.id}>
                        <ManuscriptCard
                          {...manuscript}
                          user={user}
                          teamId={id}
                          teamIdCode={manuscript.teamId}
                          grantId={manuscript.grantId}
                          isComplianceReviewer={isComplianceReviewer}
                          isTeamMember={isTeamMember}
                          isActiveTeam={!inactiveSince}
                          onUpdateManuscript={onUpdateManuscript}
                          onSave={onSave}
                          getDiscussion={getDiscussion}
                          createComplianceDiscussion={
                            createComplianceDiscussion
                          }
                          useVersionById={useVersionById}
                          onEndDiscussion={onEndDiscussion}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Paragraph noMargin accent="lead">
                  {noManuscriptCollaborations}
                </Paragraph>
              )}
            </div>
          </Card>
        </>
      )}

      {isTeamMember && (
        <Card>
          <Display styleAsHeading={3}>Collaboration Tools (Team Only)</Display>
          <Paragraph accent="lead">
            This directory contains the most important links for your team's
            internally shared resources and what each link is used for.
          </Paragraph>
          {!!tools.length && (
            <ul css={toolContainerStyles}>
              {tools.map((tool, index) => (
                <li key={`tool-${index}`}>
                  <ToolCard
                    {...tool}
                    editHref={toolsRoute.tool({ toolIndex: `${index}` }).$}
                    onDelete={onDeleteTool && (() => onDeleteTool(index))}
                  />
                </li>
              ))}
            </ul>
          )}
          <div css={newToolStyles}>
            <Link href={toolsRoute.$} buttonStyle>
              <span>Add a new team link</span>
            </Link>
          </div>
          <Caption accent="lead" asParagraph>
            Last edited on {formatDateAndTime(new Date(lastModifiedDate))}
          </Caption>
        </Card>
      )}
      {isTeamMember && pointOfContact && (
        <Card>
          <Headline2 styleAsHeading={3}>Team Contact Email</Headline2>
          <Paragraph accent="lead">
            Everyone else on the Hub can contact your team via the email address
            of your Project Manager,{' '}
            <Link href={createMailTo(pointOfContact.email)}>
              {pointOfContact.displayName}
            </Link>
            .
          </Paragraph>
          <Paragraph accent="lead">
            To assign a different team member as the Project Manager, please{' '}
            <Link href={mailToSupport()}>contact ASAP support</Link>.
          </Paragraph>
        </Card>
      )}
    </div>
  );
};

export default TeamProfileWorkspace;
