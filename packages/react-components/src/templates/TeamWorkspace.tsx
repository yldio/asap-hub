import React from 'react';
import { TeamResponse, TeamTool } from '@asap-hub/model';
import css from '@emotion/css';

import { Card, Display, Link, Caption, Headline2, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { ToolCard } from '../organisms';
import { mailToSupport, createMailTo } from '../mail';
import { formatDateAndTime } from '../utils';

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

const toolContainerStyles = css({
  display: 'grid',
  gridRowGap: `${24 / perRem}em`,
  padding: `${24 / perRem}em 0`,
});

type TeamWorkspaceProps = Pick<
  TeamResponse,
  'pointOfContact' | 'lastModifiedDate'
> & {
  tools: Array<TeamTool & { href: string }>;
  newToolHref: string;
};

const TeamWorkspace: React.FC<TeamWorkspaceProps> = ({
  pointOfContact,
  lastModifiedDate,
  tools,
  newToolHref,
}) => (
  <div css={containerStyles}>
    <Card>
      <Display styleAsHeading={3}>Team Collaboration Tools</Display>
      <Paragraph accent="lead">
        This directory contains the most important links for your team's
        internally shared resources and what each link is used for.
      </Paragraph>
      {!!tools.length && (
        <div css={toolContainerStyles}>
          {tools.map((tool, index) => (
            <ToolCard key={`tool-${index}`} {...tool} />
          ))}
        </div>
      )}
      <Link href={newToolHref} buttonStyle>
        Add a new team link
      </Link>
      <Caption asParagraph>
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
          <Link href={mailToSupport}>contact ASAP support</Link>.
        </Paragraph>
      </Card>
    )}
  </div>
);

export default TeamWorkspace;
