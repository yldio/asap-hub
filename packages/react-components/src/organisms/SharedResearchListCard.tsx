import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';

import { Card, Anchor, Headline2 } from '../atoms';
import { steel } from '../colors';
import { paddingStyles } from '../card';
import { perRem } from '../pixels';
import SharedResearchMetadata from './SharedResearchMetadata';

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

const titleStyles = css({
  marginTop: `${6 / perRem}em`,
  gridRow: '2 / span 2',
  gridColumn: 1,
});

type SharedResearchListCardProps = {
  researchOutputs: ReadonlyArray<
    Pick<ResearchOutputResponse, 'id' | 'title'> &
      ComponentProps<typeof SharedResearchMetadata>
  >;
};

const SharedResearchListCard: React.FC<SharedResearchListCardProps> = ({
  researchOutputs,
}) => (
  <Card padding={false}>
    <ul css={containerStyles}>
      {researchOutputs.map(({ title, id, ...researchOutput }) => (
        <li key={`output-${id}`} css={[itemStyles, paddingStyles]}>
          <SharedResearchMetadata {...researchOutput} />
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
