import React from 'react';
import { PageResponse } from '@asap-hub/model';

import { Display } from '../atoms';

type WhereToStartProps = {
  readonly pages: ReadonlyArray<PageResponse>;
};

const WhereToStart: React.FC<WhereToStartProps> = ({}) => {
  return (
    <section>
      <Display styleAsHeading={2}>Not sure where to start?</Display>
    </section>
  );
};

export default WhereToStart;
