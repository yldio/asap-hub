import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';

import { Card, Anchor, Headline2 } from '../atoms';
import { steel } from '../colors';
import { paddingStyles } from '../card';
import SharedResearchMetadata from './SharedResearchMetadata';

const containerStyles = css({
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

const itemStyles = css({
  borderBottom: `1px solid ${steel.rgb}`,
  display: 'grid',
  '&:last-of-type': {
    borderBottom: 'none',
  },
});

type SharedResearchListCardProps = {
  researchOutputs: ReadonlyArray<
    Pick<
      ResearchOutputResponse,
      'id' | 'title' | 'workingGroups' | 'documentType' | 'type' | 'link'
    >
  >;
};

const SharedResearchListCard: React.FC<SharedResearchListCardProps> = ({
  researchOutputs,
}) => (
  <Card padding={false}>
    <ul css={containerStyles}>
      {researchOutputs.map(
        ({ title, id, workingGroups, documentType, type, link }) => (
          <li key={`output-${id}`} css={[itemStyles, paddingStyles]}>
            <SharedResearchMetadata
              pills={[
                workingGroups ? 'Working Group' : 'Team',
                ...(documentType ? [documentType] : []),
                ...(type ? [type] : []),
              ]}
              link={link}
            />
            <Anchor
              href={
                sharedResearch({}).researchOutput({ researchOutputId: id }).$
              }
            >
              <Headline2 styleAsHeading={5}>{title}</Headline2>
            </Anchor>
          </li>
        ),
      )}
    </ul>
  </Card>
);

export default SharedResearchListCard;
