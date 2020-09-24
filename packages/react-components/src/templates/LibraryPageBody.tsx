import React, { ComponentProps } from 'react';
import { ResearchOutputResponse } from '@asap-hub/model';

import { LibraryCard } from '../organisms';

interface LibraryPageBodyProps {
  readonly researchOutput: ReadonlyArray<
    ComponentProps<typeof LibraryCard> & Pick<ResearchOutputResponse, 'id'>
  >;
}

const LibraryPageBody: React.FC<LibraryPageBodyProps> = ({
  researchOutput,
}) => (
  <>
    {researchOutput.map((output) => {
      const { id } = output;
      return (
        <div key={id}>
          <LibraryCard {...output} />
        </div>
      );
    })}
  </>
);

export default LibraryPageBody;
