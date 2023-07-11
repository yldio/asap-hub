/** @jsxImportSource @emotion/react */
import {
  useState,
  useEffect,
  useRef,
  ReactNode,
  MouseEventHandler,
  ComponentProps,
} from 'react';
import { css, Theme } from '@emotion/react';
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
  silver,
  neutral200,
} from '../colors';

const ITEM_HEIGHT = 48;
const DROPDOWN_TOP_PADDING = 5;
const NUM_ITEMS_TO_SHOW = 8.5;

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


const trimmedListStyles = css({
  overflowY: 'auto',
  maxHeight: `${(ITEM_HEIGHT * NUM_ITEMS_TO_SHOW - DROPDOWN_TOP_PADDING) / perRem}em`,
});

export type ItemType = 'title' | 'inner' | 'default';

const itemStyles = ({
  primary100 = mint,
  primary900 = pine,
  type = 'default',
}: { type?: ItemType } & Theme['colors']) =>
  css({
    whiteSpace: 'nowrap',
    color: lead.rgb,
    backgroundColor:
      type === 'title'
        ? silver.rgba
        : type === 'inner'
        ? neutral200.rgba
        : 'none',
    ':hover': {
      backgroundColor: primary100.rgba,
      span: {
        color: primary900.rgba,
      },
    },
  });

type ItemData = {
  item: ReactNode;
  type?: ItemType;
  asTitle?: boolean;
} & (LinkItemData | ButtonItemData);

type LinkItemData = {
  closeOnClick?: undefined;
  onClick?: undefined;
  href: string;
};
type ButtonItemData = {
  closeOnClick?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  href?: undefined;
};

type DropdownButtonProps = {
  children?: ReadonlyArray<ItemData>;
  buttonChildren: (menuShown: boolean) => ReactNode;
  noMargin?: boolean;
  trimmedList?: boolean;
} & Partial<Pick<ComponentProps<typeof Button>, 'primary'>>;

const DropdownButton: React.FC<DropdownButtonProps> = ({
  children = [],
  buttonChildren,
  noMargin = false,
  primary,
  trimmedList = false,
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
      <Button small primary={primary} noMargin={noMargin} onClick={handleClick}>
        {buttonChildren(menuShown)}
      </Button>
      <div css={menuWrapperStyles}>
        <div
          css={[
            menuContainerStyles,
            menuShown && showMenuStyles,
            trimmedList && trimmedListStyles,
          ]}
        >
          <ul css={listStyles}>
            {children.map(
              ({ item, type, href, onClick, closeOnClick = true }, index) => (
                <li
                  key={`drop-${index}`}
                  css={({ colors }) => itemStyles({ ...colors, type })}
                >
                  {href ? (
                    <Anchor href={href}>
                      <span css={itemContentStyles}>{item}</span>
                    </Anchor>
                  ) : (
                    <button
                      css={resetButtonStyles}
                      onClick={(e) => {
                        if (closeOnClick) {
                          setMenuShown(false);
                        }
                        onClick && onClick(e);
                      }}
                    >
                      <span css={itemContentStyles}>{item}</span>
                    </button>
                  )}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DropdownButton;
