import {
  useState,
  useEffect,
  useRef,
  ReactNode,
  MouseEventHandler,
} from 'react';
import { css } from '@emotion/react';
import { Anchor, Button } from '../atoms';
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
  minWidth: `${300 / perRem}em`,

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

const itemContentStyles = css({
  display: 'flex',
  columnGap: `${15 / perRem}rem`,
  padding: `${12 / perRem}rem ${16 / perRem}rem`,
  fontWeight: 'normal',
});

const resetButtonStyles = css({
  padding: 0,
  margin: 0,
  border: 0,
  background: 'none',
  cursor: 'pointer',
  color: 'inherit',

  ':focus': {
    outline: 'none',
    boxShadow: 'none',
  },
});

const itemStyles = css({
  whiteSpace: 'nowrap',
  color: lead.rgb,

  ':hover': {
    backgroundColor: mint.rgb,
    span: {
      color: pine.rgb,
    },
  },
});

type LinkItemData = {
  item: ReactNode;
  onClick?: undefined;
  href: string;
};
type ButtonItemData = {
  item: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  href?: undefined;
};

type DropdownButtonProps = {
  children?: ReadonlyArray<LinkItemData | ButtonItemData>;
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
        reference.current &&
        !reference.current.contains(event.target as Node)
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
            {children.map(({ item, href, onClick }, index) => (
              <li key={`drop-${index}`} css={itemStyles}>
                {href ? (
                  <Anchor href={href}>
                    <span css={itemContentStyles}>{item}</span>
                  </Anchor>
                ) : (
                  <button css={resetButtonStyles} onClick={onClick}>
                    <span css={itemContentStyles}>{item}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DropdownButton;
