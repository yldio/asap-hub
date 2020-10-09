import React, { ComponentProps } from 'react';

import { LibraryCard } from '../organisms';
import CardList from '../organisms/CardList';

type LibraryPageBodyProps = Omit<
  ComponentProps<typeof CardList>,
  'children'
> & {
  readonly researchOutputs: ReadonlyArray<
    ComponentProps<typeof LibraryCard> & { id: string }
  >;
};

const LibraryPageBody: React.FC<LibraryPageBodyProps> = ({
  researchOutputs,
  ...cardListProps
}) => (
  <CardList {...cardListProps}>
    {researchOutputs.map(({ id, ...output }) => (
      <div key={id}>
        <LibraryCard {...output} />
      </div>
    ))}
  </CardList>
);

export default LibraryPageBody;
