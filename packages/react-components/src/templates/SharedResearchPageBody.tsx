import { sharedResearch } from '@asap-hub/routing';
import React, { ComponentProps } from 'react';

import { ResultList, SharedResearchCard } from '../organisms';

type SharedResearchPageBodyProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly researchOutputs: ReadonlyArray<
    ComponentProps<typeof SharedResearchCard> & { id: string }
  >;
  readonly listViewParams: string;
  readonly detailsViewParams: string;
};

const SharedResearchPageBody: React.FC<SharedResearchPageBodyProps> = ({
  researchOutputs,
  listViewParams,
  detailsViewParams,
  ...cardListProps
}) => (
  <ResultList
    {...cardListProps}
    listViewHref={sharedResearch({}).$ + listViewParams}
    detailsViewHref={sharedResearch({}).$ + detailsViewParams}
  >
    {researchOutputs.map((output) => (
      <div key={output.id}>
        <SharedResearchCard {...output} />
      </div>
    ))}
  </ResultList>
);
export default SharedResearchPageBody;
