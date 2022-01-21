import { useState, useEffect, useRef, ReactNode } from 'react';
import { css } from '@emotion/react';
import { Button } from '../atoms';
import { perRem, mobileScreen, formTargetWidth } from '../pixels';

import {
  paper,
  steel,
  colorWithTransparency,
  tin,
  mint,
  lead,
  pine,
} from '../colors';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    width: '100%',
  },
});

const menuWrapperStyles = css({
  position: 'relative',
  display: 'flex',
  maxWidth: `${formTargetWidth / perRem}em`,
});

const menuContainerStyles = css({
  position: 'absolute',
  display: 'none',
  overflow: 'hidden',
  zIndex: 1,
  minWidth: `${245 / perRem}em`,

  width: '100%',
  top: 0,
  right: 0,
  backgroundColor: paper.rgb,
  border: `1px solid ${steel.rgb}`,
  boxShadow: `0 2px 6px 0 ${colorWithTransparency(tin, 0.34).rgba}`,

  flexDirection: 'column',

  padding: `${6 / perRem}em 0`,
});

const showMenuStyles = css({
  display: 'flex',
});

const listStyles = css({
  display: 'flex',
  flexDirection: 'column',
  listStyle: 'none',
  margin: 0,
  padding: 0,

  '& > li': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
  },
});

const itemStyles = css({
  display: 'flex',
  whiteSpace: 'nowrap',
  padding: `${12 / perRem}rem ${16 / perRem}rem`,
  color: lead.rgb,

  ':hover': {
    color: pine.rgb,
    backgroundColor: mint.rgb,
    svg: {
      fill: pine.rgb,
      stroke: pine.rgb,
    },
  },
});

type DropdownButtonProps = {
  children?: React.ReactElement[];
  buttonChildren: (menuShown: boolean) => ReactNode;
};

const DropdownButton: React.FC<DropdownButtonProps> = ({
  children = [],
  buttonChildren,
}) => {
  const reference = useRef<HTMLDivElement>(null);
  const handleClick = () => setMenuShown(!menuShown);
  const [menuShown, setMenuShown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        reference &&
        reference.current &&
        !reference?.current?.contains(event.target as Node)
      ) {
        setMenuShown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [reference]);

  return (
    <div css={containerStyles} ref={reference}>
      <Button small onClick={handleClick}>
        {buttonChildren(menuShown)}
      </Button>
      <div css={menuWrapperStyles}>
        <div css={[menuContainerStyles, menuShown && showMenuStyles]}>
          <ul css={listStyles}>
            {children.map((child, index) => (
              <li key={`drop-${index}`}>
                <div css={itemStyles}>{child}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DropdownButton;
