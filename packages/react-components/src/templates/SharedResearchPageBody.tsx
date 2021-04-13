import { sharedResearch } from '@asap-hub/routing';
import React, { ComponentProps } from 'react';

import {
  ResultList,
  SharedResearchCard,
  SharedResearchList,
} from '../organisms';

type SharedResearchPageBodyProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly researchOutputs: ReadonlyArray<
    ComponentProps<typeof SharedResearchCard> & { id: string }
  >;
  readonly listViewParams: string;
  readonly cardViewParams: string;
};

const SharedResearchPageBody: React.FC<SharedResearchPageBodyProps> = ({
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
      <SharedResearchList researchOutputs={researchOutputs} />
    ) : (
      researchOutputs.map((output) => (
        <div key={output.id}>
          <SharedResearchCard {...output} />
        </div>
      ))
    )}
  </ResultList>
);
export default SharedResearchPageBody;
