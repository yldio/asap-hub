/** @jsxImportSource @emotion/react */
import {
  useState,
  useEffect,
  useRef,
  ReactNode,
  MouseEventHandler,
  ComponentProps,
} from 'react';
import { css } from '@emotion/react';
import { Button, chevronUpIcon, chevronDownIcon } from '..';

import { perRem, mobileScreen, formTargetWidth } from '../pixels';

import {
  paper,
  steel,
  colorWithTransparency,
  tin,
  lead,
  neutral200,
  info100,
  info500,
  warning100,
  warning500,
  success100,
  success500,
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
  width: `${250 / perRem}em`,
  top: `${8 / perRem}em`,
  left: 0,
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

export type StatusType = 'warning' | 'final' | 'default';

const itemContentStyles = (type: StatusType = 'default') =>
  css({
    display: 'flex',
    columnGap: `${15 / perRem}rem`,
    padding: `${4 / perRem}rem ${16 / perRem}rem`,
    fontWeight: 'normal',
    fontSize: '14px',
    margin: `${8 / perRem}em ${16 / perRem}em !important`,
    backgroundColor: info100.rgba,
    color: info500.rgba,
    borderRadius: `${24 / perRem}em`,
    alignSelf: 'initial',
    maxWidth: 'fit-content',
    ...(type === 'warning'
      ? {
          color: warning500.rgba,
          backgroundColor: warning100.rgba,
        }
      : {}),
    ...(type === 'final'
      ? {
          color: success500.rgba,
          backgroundColor: success100.rgba,
        }
      : {}),
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

const alignLeftStyles = css({
  left: 0,
});

const statusButtonStyles = css({
  borderRadius: `${24 / perRem}em`,
  fontWeight: 400,
  border: 'none',
  background: info100.rgba,
  color: info500.rgba,
  'svg #Group-7': {
    stroke: info500.rgba,
  },
  paddingLeft: `${16 / perRem}em`,
  paddingRight: `${8 / perRem}em !important`,
  maxWidth: 'fit-content',
});

const statusTagStyles = css({
  borderRadius: `${24 / perRem}em`,
  fontWeight: 400,
  border: 'none',
  background: info100.rgba,
  color: info500.rgba,
  paddingLeft: `${16 / perRem}em`,
  paddingRight: `${16 / perRem}em`,
  maxWidth: 'fit-content',
});

const itemStyles = css({
  color: lead.rgb,
  backgroundColor: 'none',
  ':hover': {
    backgroundColor: neutral200.rgba,
  },
});

type ButtonItemData = {
  item: ReactNode;
  type?: StatusType;
  closeOnClick?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

type StatusButtonProps = {
  children?: ReadonlyArray<ButtonItemData>;
  buttonChildren: (menuShown: boolean) => ReactNode;
  alignLeft?: boolean;
  canEdit?: boolean;
} & Partial<Pick<ComponentProps<typeof Button>, 'primary'>>;

const StatusButton: React.FC<StatusButtonProps> = ({
  children = [],
  buttonChildren,
  alignLeft = false,
  primary,
  canEdit = false,
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
      <Button
        data-testid="status-button"
        small
        noMargin
        primary={primary}
        onClick={handleClick}
        enabled={canEdit}
        overrideStyles={canEdit ? statusButtonStyles : statusTagStyles}
      >
        <>
          {buttonChildren(menuShown)}
          {canEdit ? (menuShown ? chevronUpIcon : chevronDownIcon) : null}
        </>
      </Button>
      <div css={menuWrapperStyles}>
        <div
          css={[
            menuContainerStyles,
            menuShown && showMenuStyles,
            alignLeft && alignLeftStyles,
          ]}
        >
          <ul css={listStyles}>
            {children.map(
              (
                { item, type = 'default', onClick, closeOnClick = true },
                index,
              ) => (
                <li key={`drop-${index}`} css={itemStyles}>
                  <button
                    css={[resetButtonStyles]}
                    onClick={(e) => {
                      if (closeOnClick) {
                        setMenuShown(false);
                      }
                      onClick && onClick(e);
                    }}
                  >
                    <span css={itemContentStyles(type)}>{item}</span>
                  </button>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatusButton;
