import { isEnabled } from '@asap-hub/flags';
import { TeamResponse, TeamTool } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Button,
  Caption,
  Card,
  Display,
  Headline2,
  Link,
  Paragraph,
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
  readonly setEligibilityReasons: (newEligibilityReason: Set<string>) => void;
};

const TeamProfileWorkspace: React.FC<TeamProfileWorkspaceProps> = ({
  id,
  pointOfContact,
  lastModifiedDate,
  manuscripts,
  tools,
  onDeleteTool,
  setEligibilityReasons,
}) => {
  const [displayEligibilityModal, setDisplayEligibilityModal] = useState(false);
  const history = useHistory();

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
          <Card>
            <div css={complianceContainerStyles}>
              <div css={complianceHeaderStyles}>
                <Display styleAsHeading={3}>Compliance Review</Display>
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
              </div>
              <Paragraph accent="lead">
                Submit your manuscript to receive a report outlining where your
                work meets ASAP's Open Science Policy and where changes are
                needed for your work to be compliant
              </Paragraph>
            </div>
            {manuscripts.map((manuscript) => (
              <div key={manuscript.id}>
                <ManuscriptCard {...manuscript} />
              </div>
            ))}
          </Card>
        </>
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
