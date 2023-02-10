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
      researchOutputs.map((output) => (
        <SharedResearchCard key={output.id} {...output} />
      ))
    )}
  </ResultList>
);
export default SharedResearchList;
