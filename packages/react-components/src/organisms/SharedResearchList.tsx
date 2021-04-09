import React from 'react';
import css from '@emotion/css';
import { ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';

import { Card, Anchor, Headline2, TagLabel } from '../atoms';
import { steel } from '../colors';
import { ExternalLink } from '../molecules';
import { paddingStyles } from '../card';

const containerStyles = css({
  '~ div:last-of-type': {
    borderBottom: 'none',
  },
});

const itemStyles = css({
  borderBottom: `1px solid ${steel.rgb}`,
  display: 'grid',
  gridTemplateRows: 'auto 12px auto',
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
  gridRow: '2 / span 2',
  gridColumn: 1,
});

const typeStyles = css({
  display: 'flex',
  alignItems: 'center',
  textTransform: 'capitalize',
});

type SharedResearchListProps = {
  researchOutputs: ReadonlyArray<
    Pick<ResearchOutputResponse, 'id' | 'title' | 'type' | 'link'>
  >;
};

const SharedResearchList: React.FC<SharedResearchListProps> = ({
  researchOutputs,
}) => (
  <Card padding={false}>
    <div css={containerStyles}>
      {researchOutputs.map(({ type, link, title, id }) => (
        <div key={`output-${id}`} css={[itemStyles, paddingStyles]}>
          <div css={headerStyles}>
            <div css={typeStyles}>
              <TagLabel>{type}</TagLabel>
            </div>
            {link ? <ExternalLink href={link} label="" /> : null}
          </div>
          <div css={titleStyles}>
            {link ? (
              <Headline2 styleAsHeading={5}>{title}</Headline2>
            ) : (
              <Anchor
                href={
                  sharedResearch({}).researchOutput({ researchOutputId: id }).$
                }
              >
                <Headline2 styleAsHeading={5}>{title}</Headline2>
              </Anchor>
            )}
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default SharedResearchList;
