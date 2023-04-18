import { ComponentProps } from 'react';
import AlgoliaHit from '../atoms/AlgoliaHit';

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
    Omit<
      ComponentProps<typeof SharedResearchCard>,
      'workingGroupAssociation'
    > & { id: string }
  >;
  readonly listViewHref: string;
  readonly cardViewHref: string;
};

const SharedResearchList: React.FC<SharedResearchListProps> = ({
  researchOutputs,
  ...cardListProps
}) => (
  <ResultList {...cardListProps}>
    {cardListProps.isListView ? (
      <SharedResearchListCard researchOutputs={researchOutputs} />
    ) : (
      researchOutputs.map((output, index) => (
        <AlgoliaHit key={output.id} index={index}>
          <SharedResearchCard {...output} />
        </AlgoliaHit>
      ))
    )}
  </ResultList>
);
export default SharedResearchList;
