import css from '@emotion/css';
import React, { ComponentProps } from 'react';
import { ComingSoon, SharedResearchCard } from '../organisms';
import { perRem } from '../pixels';

const containerStyles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

export type TeamProfileOutputsProps = {
  outputs: ReadonlyArray<
    ComponentProps<typeof SharedResearchCard> & { id: string }
  >;
};

const TeamProfileOutputs: React.FC<TeamProfileOutputsProps> = ({ outputs }) => (
  <div css={containerStyles}>
    {outputs.map(({ id, ...output }) => (
      <SharedResearchCard key={id} {...output} />
    ))}
    <ComingSoon>
      As teams create and share more research outputs - such as datasets,
      protocols, code and other resources - they will be listed here. As
      information is shared, teams should be mindful to respect intellectual
      boundaries. No investigator or team should act on any of the privileged
      information shared within the Network without express permission from and
      credit to the investigator(s) that shared the information.
    </ComingSoon>
  </div>
);

export default TeamProfileOutputs;
