import { ComponentProps } from 'react';
import AlgoliaHit from '../atoms/AlgoliaHit';

import {
  ResultList,
  SharedResearchCard,
  SharedResearchListCard,
} from '../organisms';
import { LibraryIcon } from '../icons';
import { charcoal } from '../colors';

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
} & Pick<ComponentProps<typeof AlgoliaHit>, 'algoliaQueryId'>;

const SharedResearchList: React.FC<SharedResearchListProps> = ({
  researchOutputs,
  algoliaQueryId,
  ...cardListProps
}) => (
  <ResultList icon={<LibraryIcon color={charcoal.rgb} />} {...cardListProps}>
    {cardListProps.isListView ? (
      <SharedResearchListCard
        algoliaQueryId={algoliaQueryId}
        researchOutputs={researchOutputs}
      />
    ) : (
      researchOutputs.map((output, index) => (
        <AlgoliaHit
          key={output.id}
          index={index}
          algoliaQueryId={algoliaQueryId}
          objectId={output.id}
        >
          <SharedResearchCard {...output} />
        </AlgoliaHit>
      ))
    )}
  </ResultList>
);
export default SharedResearchList;
