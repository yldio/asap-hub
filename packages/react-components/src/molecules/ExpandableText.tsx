import { css } from '@emotion/react';
import React, { useLayoutEffect, useState } from 'react';

import {
  Button,
  chevronCircleDownIcon,
  colorWithTransparency,
  lead,
  pixels,
} from '..';

const { rem, lineHeight } = pixels;

const expandableMaxHeight = 120;

const textStyles = css({
  maxHeight: rem(expandableMaxHeight),
  overflowY: 'clip',
  margin: 0,
});

const expandedTextStyles = css({
  maxHeight: rem(lineHeight * 500), // aproximation of possible max height (2500 characters)
  transition: 'max-height 300ms linear',
  background: colorWithTransparency(lead, 0).rgba,
});

const expandableTextStyles = css({
  maxHeight: rem(expandableMaxHeight),
  background: `linear-gradient(180deg, ${lead.rgb} 26.56%, ${
    colorWithTransparency(lead, 0).rgba
  } 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  transition: 'max-height 300ms linear',
});

const buttonContainerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginTop: rem(16),
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
  const [showToggle, setShowToggle] = useState(false);
  const textElement = React.useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    setShowToggle(
      (textElement?.current?.scrollHeight || 0) > expandableMaxHeight,
    );
  }, [textElement?.current?.scrollHeight]);

  return (
    <div>
      <div
        css={[
          textStyles,
          expanded ? expandedTextStyles : showToggle && expandableTextStyles,
        ]}
        ref={textElement}
      >
        {children}
      </div>
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
