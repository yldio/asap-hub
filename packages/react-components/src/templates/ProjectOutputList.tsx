import { ComponentProps } from 'react';
import AlgoliaHit from '../atoms/AlgoliaHit';

import {
  ResultList,
  ProjectOutputCard,
  ProjectOutputListCard,
} from '../organisms';
import type { ProjectOutput } from '../molecules';
import { LibraryIcon } from '../icons';
import { charcoal } from '../colors';

const RESULT_LIST_ICON = <LibraryIcon color={charcoal.rgb} />;

type ProjectOutputListProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly researchOutputs: ReadonlyArray<ProjectOutput>;
  readonly listViewHref: string;
  readonly cardViewHref: string;
  showTags?: boolean;
} & Pick<ComponentProps<typeof AlgoliaHit>, 'algoliaQueryId'>;

const ProjectOutputList: React.FC<ProjectOutputListProps> = ({
  researchOutputs,
  algoliaQueryId,
  showTags = true,
  ...cardListProps
}) => (
  <ResultList icon={RESULT_LIST_ICON} {...cardListProps}>
    {cardListProps.isListView ? (
      <ProjectOutputListCard
        algoliaQueryId={algoliaQueryId}
        researchOutputs={researchOutputs}
        showTags={showTags}
      />
    ) : (
      researchOutputs.map((output, index) => (
        <AlgoliaHit
          key={output.id}
          index={index}
          algoliaQueryId={algoliaQueryId}
          objectId={output.id}
        >
          <ProjectOutputCard {...output} showTags={showTags} />
        </AlgoliaHit>
      ))
    )}
  </ResultList>
);
export default ProjectOutputList;
