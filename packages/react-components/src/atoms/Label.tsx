import React, { useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { perRem, formTargetWidth } from '../pixels';

interface LabelProps {
  readonly children: React.ReactNode;
  readonly forContent: (id: string) => React.ReactNode;
}
const Label: React.FC<LabelProps> = ({ children, forContent }) => {
  const contentId = useRef(uuidV4());
  return (
    <div
      css={{
        width: `${formTargetWidth / perRem}em`,
        maxWidth: `min(${formTargetWidth / perRem}em, 100%)`,
        paddingBottom: `${18 / perRem}em`,
      }}
    >
      <label htmlFor={contentId.current}>{children}</label>
      {forContent(contentId.current)}
    </div>
  );
};

export default Label;
