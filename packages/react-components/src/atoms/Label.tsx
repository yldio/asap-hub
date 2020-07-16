import React, { useRef } from 'react';
import css from '@emotion/css';
import { v4 as uuidV4 } from 'uuid';

import { perRem, formTargetWidth } from '../pixels';

const containerStyles = css({
  width: `${formTargetWidth / perRem}em`,
  maxWidth: `min(${formTargetWidth / perRem}em, 100%)`,

  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

/*
 if we need more layout flexiblity at some point, consider making this a hook instead:
 useLabel(children: ReactNode) => { label: ReactElement, id: string }
*/
interface LabelProps {
  readonly children: React.ReactNode;
  readonly forContent: (id: string) => React.ReactNode;
  readonly trailing?: boolean;
}
const Label: React.FC<LabelProps> = ({
  children,
  forContent,
  trailing = false,
}) => {
  const contentId = useRef(uuidV4());
  return (
    <div css={containerStyles}>
      {trailing || <label htmlFor={contentId.current}>{children}</label>}
      {forContent(contentId.current)}
      {trailing && <label htmlFor={contentId.current}>{children}</label>}
    </div>
  );
};

export default Label;
