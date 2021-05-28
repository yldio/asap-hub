import { sharedResearch } from '@asap-hub/routing';
import { ComponentProps } from 'react';

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
        <SharedResearchCard key={output.id} {...output} />
      ))
    )}
  </ResultList>
);
export default SharedResearchList;
