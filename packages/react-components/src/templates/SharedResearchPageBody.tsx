import React, { ComponentProps } from 'react';

import { SharedResearchCard } from '../organisms';
import CardList from '../organisms/CardList';

type SharedResearchPageBodyProps = Omit<
  ComponentProps<typeof CardList>,
  'children'
> & {
  readonly researchOutputs: ReadonlyArray<
    ComponentProps<typeof SharedResearchCard> & { id: string }
  >;
};

const SharedResearchPageBody: React.FC<SharedResearchPageBodyProps> = ({
  researchOutputs,
  ...cardListProps
}) => (
  <CardList {...cardListProps}>
    {researchOutputs.map(({ id, ...output }) => (
      <div key={id}>
        <SharedResearchCard {...output} />
      </div>
    ))}
  </CardList>
);

export default SharedResearchPageBody;
