import {
  Button,
  chevronCircleDownIcon,
  colorWithTransparency,
  lead,
  pixels,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import { useRef, useState } from 'react';

const { rem } = pixels;

const expandableMaxHeight = 120;

const textStyles = css({
  maxHeight: rem(expandableMaxHeight),
  overflowY: 'clip',
});

const expandedTextStyles = css({
  maxHeight: rem(24 * 250), //aproximation of possible max height (2500 characters) 100 chars per line
  transition: 'max-height 200ms ease-in-out',
  background: colorWithTransparency(lead, 0).rgba,
});

const expandableTextStyles = css({
  maxHeight: rem(expandableMaxHeight),
  background: `linear-gradient(180deg, ${lead.rgb} 26.56%, ${
    colorWithTransparency(lead, 0).rgba
  } 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  transition: 'max-height 300ms ease-in-out, background 300ms ease-in',
});

const buttonContainerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

const expandableButtonIcon = css({
  marginLeft: rem(12),
  display: 'inline-grid',
  verticalAlign: 'middle',
  svg: {
    transition: '250ms',
  },
});
const expandedButtonIcon = css({
  svg: {
    transform: 'rotate(180deg)',
  },
});

const ExpandableText: React.FC = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const textElement = useRef<HTMLParagraphElement>(null);

  const showToggle =
    (textElement.current?.scrollHeight || 0) > expandableMaxHeight;

  return (
    <div>
      <p
        css={[
          textStyles,
          expanded ? expandedTextStyles : showToggle && expandableTextStyles,
        ]}
        ref={textElement}
      >
        {children}
      </p>
      {showToggle && (
        <div css={buttonContainerStyles}>
          <Button linkStyle onClick={() => setExpanded(!expanded)}>
            Show {expanded ? 'less' : 'more'}
            <span css={[expandableButtonIcon, expanded && expandedButtonIcon]}>
              {chevronCircleDownIcon}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpandableText;
