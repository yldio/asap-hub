import { useRef } from 'react';
import { css } from '@emotion/react';
import { v4 as uuidV4 } from 'uuid';
import { noop } from '../utils';

const containerStyles = css({
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
  readonly onHover?: () => void;
  readonly onLeave?: () => void;
}
const Label: React.FC<LabelProps> = ({
  children,
  forContent,
  trailing = false,
  onHover = noop,
  onLeave = noop,
}) => {
  const contentId = useRef(uuidV4());
  return (
    <div
      css={containerStyles}
      onMouseOver={onHover}
      onMouseLeave={onLeave}
      data-testid={`label-${contentId.current}`}
    >
      {trailing || <label htmlFor={contentId.current}>{children}</label>}
      {forContent(contentId.current)}
      {trailing && <label htmlFor={contentId.current}>{children}</label>}
    </div>
  );
};

export default Label;
