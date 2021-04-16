import { sharedResearch } from '@asap-hub/routing';
import React, { ComponentProps } from 'react';

import {
  ResultList,
  SharedResearchCard,
  SharedResearchListCard,
} from '../organisms';

type SharedResearchListProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly researchOutputs: ReadonlyArray<
    ComponentProps<typeof SharedResearchCard> & { id: string }
  >;
  readonly listViewParams: string;
  readonly cardViewParams: string;
};

const SharedResearchList: React.FC<SharedResearchListProps> = ({
  researchOutputs,
  listViewParams,
  cardViewParams,
  ...cardListProps
}) => (
  <ResultList
    {...cardListProps}
    listViewHref={sharedResearch({}).$ + listViewParams}
    cardViewHref={sharedResearch({}).$ + cardViewParams}
  >
    {cardListProps.isListView ? (
      <SharedResearchListCard researchOutputs={researchOutputs} />
    ) : (
      researchOutputs.map((output) => (
        <div key={output.id}>
          <SharedResearchCard {...output} />
        </div>
      ))
    )}
  </ResultList>
);
export default SharedResearchList;
