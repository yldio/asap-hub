import { ComponentProps } from 'react';
import { ResearchOutputResponse } from '@asap-hub/model';
import AlgoliaHit from '../atoms/AlgoliaHit';

import { charcoal } from '../colors';
import { LibraryIcon } from '../icons';
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
  showTags?: boolean;
} & Pick<ComponentProps<typeof AlgoliaHit>, 'algoliaQueryId'>;

const SharedResearchList: React.FC<SharedResearchListProps> = ({
  researchOutputs,
  algoliaQueryId,
  showTags = false,
  ...cardListProps
}) => (
  <ResultList icon={<LibraryIcon color={charcoal.rgb} />} {...cardListProps}>
    {cardListProps.isListView ? (
      <SharedResearchListCard
        algoliaQueryId={algoliaQueryId}
        researchOutputs={researchOutputs as ResearchOutputResponse[]}
      />
    ) : (
      researchOutputs.map((output, index) => (
        <AlgoliaHit
          key={output.id}
          index={index}
          algoliaQueryId={algoliaQueryId}
          objectId={output.id}
        >
          <SharedResearchCard
            {...(output as ResearchOutputResponse)}
            showTags={showTags}
          />
        </AlgoliaHit>
      ))
    )}
  </ResultList>
);
export default SharedResearchList;
