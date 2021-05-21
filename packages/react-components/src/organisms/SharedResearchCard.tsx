import { css } from '@emotion/react';
import { researchOutputLabels, ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';

import { Card, Anchor, Headline2, Caption, TagLabel } from '../atoms';
import { ExternalLink, TeamsList } from '../molecules';
import { formatDate } from '../date';

const containerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
});

const headerStyles = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const textStyles = css({
  flexBasis: '100%',
});

const typeStyles = css({
  display: 'flex',
  alignItems: 'center',
  textTransform: 'capitalize',
});

type SharedResearchCardProps = Pick<
  ResearchOutputResponse,
  'id' | 'created' | 'addedDate' | 'teams' | 'title' | 'type' | 'link'
>;

const SharedResearchCard: React.FC<SharedResearchCardProps> = ({
  id,
  created,
  link,
  addedDate,
  teams,
  title,
  type,
}) => (
  <Card>
    <div css={containerStyles}>
      <div css={headerStyles}>
        <div css={typeStyles}>
          <TagLabel>{type}</TagLabel>
        </div>
        {link ? (
          <ExternalLink label={researchOutputLabels[type]} href={link} />
        ) : null}
      </div>
      <div css={textStyles}>
        <Anchor
          href={sharedResearch({}).researchOutput({ researchOutputId: id }).$}
        >
          <Headline2 styleAsHeading={4}>{title}</Headline2>
        </Anchor>
        <TeamsList inline max={3} teams={teams} />
      </div>
      <Caption accent={'lead'} asParagraph>
        Date Added: {formatDate(new Date(addedDate || created))}
      </Caption>
    </div>
  </Card>
);

export default SharedResearchCard;
