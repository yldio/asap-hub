import React from 'react';
import css from '@emotion/css';
import { ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';

import { Card, Anchor, TagLabel, Headline2 } from '../atoms';
import { steel } from '../colors';
import { ExternalLink } from '../molecules';
import { paddingStyles } from '../card';
import { perRem } from '../pixels';

const containerStyles = css({
  margin: 0,
  padding: 0,
  listStyle: 'none',
});
const itemStyles = css({
  borderBottom: `1px solid ${steel.rgb}`,
  display: 'grid',
  gridTemplateRows: 'auto 12px auto',
  '&:last-of-type': {
    borderBottom: 'none',
  },
});

const headerStyles = css({
  flex: 1,
  gridRow: '1 / span 2',
  gridColumn: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});
const titleStyles = css({
  marginTop: `${6 / perRem}em`,
  gridRow: '2 / span 2',
  gridColumn: 1,
});

const typeStyles = css({
  display: 'flex',
  alignItems: 'center',
  textTransform: 'capitalize',
});

type SharedResearchListCardProps = {
  researchOutputs: ReadonlyArray<
    Pick<ResearchOutputResponse, 'id' | 'title' | 'type' | 'link'>
  >;
};

const SharedResearchListCard: React.FC<SharedResearchListCardProps> = ({
  researchOutputs,
}) => (
  <Card padding={false}>
    <ul css={containerStyles}>
      {researchOutputs.map(({ type, link, title, id }) => (
        <li key={`output-${id}`} css={[itemStyles, paddingStyles]}>
          <div css={headerStyles}>
            <div css={typeStyles}>
              <TagLabel>{type}</TagLabel>
            </div>
            {link ? <ExternalLink href={link} label="" /> : null}
          </div>
          <div css={titleStyles}>
            <Anchor
              href={
                sharedResearch({}).researchOutput({ researchOutputId: id }).$
              }
            >
              <Headline2 styleAsHeading={5}>{title}</Headline2>
            </Anchor>
          </div>
        </li>
      ))}
    </ul>
  </Card>
);

export default SharedResearchListCard;
