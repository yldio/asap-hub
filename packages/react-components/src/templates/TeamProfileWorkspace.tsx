import { isEnabled } from '@asap-hub/flags';
import { TeamResponse, TeamTool } from '@asap-hub/model';
import { networkRoutes } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { Caption, Card, Display, Headline2, Link, Paragraph } from '../atoms';
import { formatDateAndTime } from '../date';
import { plusIcon } from '../icons';
import { createMailTo, mailToSupport } from '../mail';
import { ToolCard } from '../organisms';
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

type TeamProfileWorkspaceProps = Readonly<
  Pick<
    TeamResponse,
    'id' | 'pointOfContact' | 'lastModifiedDate' | 'manuscripts'
  >
> & {
  readonly tools: ReadonlyArray<TeamTool>;
  readonly onDeleteTool?: (toolIndex: number) => Promise<void>;
};

const TeamProfileWorkspace: React.FC<TeamProfileWorkspaceProps> = ({
  id,
  pointOfContact,
  lastModifiedDate,
  manuscripts,
  tools,
  onDeleteTool,
}) => {
  const toolsRoute = networkRoutes.DEFAULT.path; // TODO: fix this
  // network({})
  //   .teams({})
  //   .team({ teamId: id })
  //   .workspace({})
  //   .tools({});

  const manuscriptRoute = networkRoutes.DEFAULT.path; // TODO: fix this
  // network({})
  //   .teams({})
  //   .team({ teamId: id })
  //   .workspace({})
  //   .createManuscript({}).$;

  return (
    <div css={containerStyles}>
      {isEnabled('DISPLAY_MANUSCRIPTS') && (
        <Card>
          <div css={complianceContainerStyles}>
            <div css={complianceHeaderStyles}>
              <Display styleAsHeading={3}>Compliance</Display>
              <div css={css(manuscriptButtonStyles)}>
                <Link href={manuscriptRoute} primary noMargin small buttonStyle>
                  {plusIcon} Share Manuscript
                </Link>
              </div>
            </div>
            <Paragraph accent="lead">
              This directory contains all manuscripts with their compliance
              reports.
            </Paragraph>
          </div>
          {manuscripts.map((manuscript) => (
            <div key={manuscript.id}>
              <ManuscriptCard {...manuscript} />
            </div>
          ))}
        </Card>
      )}

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
      {pointOfContact && (
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
