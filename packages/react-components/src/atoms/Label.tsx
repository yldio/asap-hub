import { useRef } from 'react';
import { css } from '@emotion/react';
import { v4 as uuidV4 } from 'uuid';

const containerStyles = css({
  display: 'flex',
  alignItems: 'center',
});

const wrapStyles = css({
  flexWrap: 'wrap',
});

const noWrapStyles = css({
  flexWrap: 'nowrap',
});

/*
 if we need more layout flexiblity at some point, consider making this a hook instead:
 useLabel(children: ReactNode) => { label: ReactElement, id: string }
*/
interface LabelProps {
  readonly children: React.ReactNode;
  readonly forContent: (id: string) => React.ReactNode;
  readonly trailing?: boolean;
  readonly title?: string;
  readonly wrapLabel?: boolean;
}
const Label: React.FC<LabelProps> = ({
  children,
  forContent,
  trailing = false,
  wrapLabel = true,
  title,
}) => {
  const contentId = useRef(uuidV4());
  return (
    <div
      css={[containerStyles, wrapLabel ? wrapStyles : noWrapStyles]}
      title={title}
      data-testid={`label-${contentId.current}`}
    >
      {trailing || <label htmlFor={contentId.current}>{children}</label>}
      {forContent(contentId.current)}
      {trailing && <label htmlFor={contentId.current}>{children}</label>}
    </div>
  );
};

export default Label;
