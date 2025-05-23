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
import {
  Button,
  chevronUpIcon,
  chevronDownIcon,
  successIconNew,
  infoCircleYellowIcon,
} from '..';

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

export type StatusType = 'warning' | 'final' | 'default' | 'none';

export const itemContentStyles = (type: StatusType = 'default') =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    columnGap: `${15 / perRem}rem`,
    padding: `${4 / perRem}rem ${14 / perRem}rem`,
    fontWeight: 'normal',
    fontSize: '14px',
    margin: `${8 / perRem}em ${16 / perRem}em !important`,
    backgroundColor: info100.rgba,
    color: info500.rgba,
    borderRadius: `${24 / perRem}em`,
    alignSelf: 'initial',
    maxWidth: 'fit-content',
    ...(type === 'warning' || type === 'final'
      ? {
          color: type === 'warning' ? warning500.rgba : success500.rgba,
          backgroundColor:
            type === 'warning' ? warning100.rgba : success100.rgba,
          columnGap: `${6 / perRem}rem`,
          padding: `${4 / perRem}rem ${16 / perRem}rem ${4 / perRem}rem ${
            8 / perRem
          }rem`,
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

export const statusButtonStyles = (
  type: StatusType,
  isComplianceReviewer: boolean,
  noWrap: boolean = true,
) =>
  css({
    borderRadius: `${24 / perRem}em`,
    fontWeight: 400,
    border: 'none',
    background: info100.rgba,
    color: info500.rgba,
    ...(type === 'warning'
      ? {
          background: warning100.rgba,
          color: warning500.rgba,
        }
      : type === 'final'
        ? {
            background: success100.rgba,
            color: success500.rgba,
          }
        : {}),
    'svg #Group-7': {
      stroke: info500.rgba,
      ...([isComplianceReviewer ? 'warning' : 'default', 'final'].includes(type)
        ? {
            stroke: warning500.rgba,
          }
        : {}),
    },
    paddingLeft: `${16 / perRem}em`,
    paddingRight: `${8 / perRem}em !important`,
    ...(noWrap ? { textWrap: 'nowrap' } : {}),
    maxWidth: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    gap: `${8 / perRem}em`,
  });

export const statusTagStyles = (type: StatusType, noWrap: boolean = true) =>
  css({
    borderRadius: `${24 / perRem}em`,
    fontWeight: 400,
    border: 'none',
    background: info100.rgba,
    color: info500.rgba,
    ...(type === 'default'
      ? {
          background: warning100.rgba,
          color: warning500.rgba,
        }
      : type === 'final'
        ? {
            background: success100.rgba,
            color: success500.rgba,
          }
        : {}),
    paddingLeft: `${16 / perRem}em`,
    paddingRight: `${16 / perRem}em`,
    ...(noWrap ? { textWrap: 'nowrap' } : {}),
    maxWidth: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    gap: `${8 / perRem}em`,
  });

const itemStyles = css({
  color: lead.rgb,
  backgroundColor: 'none',
  ':hover': {
    backgroundColor: neutral200.rgba,
  },
});

export const iconStyles = (type: string, isComplianceReviewer: boolean) =>
  css({
    display: 'flex',
    alignSelf: 'center',

    '& > svg': {
      width: '16px',
      height: '16px',
      filter: 'revert!important',
      WebkitFilter: 'revert!important',
      ...((type === 'warning' && isComplianceReviewer) ||
      (type === 'default' && !isComplianceReviewer)
        ? {
            '& > g > path': {
              fill: warning500.rgba,
            },
          }
        : {}),
      '& > rect:first-of-type': {
        ...(type === 'final' ? { fill: success500.rgba } : {}),
      },
      '& > rect:last-of-type': {
        stroke: info500.rgba,
        ...(type === 'final' ? { stroke: success500.rgba } : {}),
      },
    },
  });

export const statusIcon = (type: StatusType, isComplianceReviewer: boolean) =>
  ({
    warning: isComplianceReviewer ? infoCircleYellowIcon : '',
    final: successIconNew,
    default: isComplianceReviewer ? '' : infoCircleYellowIcon,
    none: '',
  })[type];

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
  selectedStatusType?: StatusType;
  wrap?: boolean;
} & Partial<Pick<ComponentProps<typeof Button>, 'primary'>>;

const StatusButton: React.FC<StatusButtonProps> = ({
  children = [],
  buttonChildren,
  alignLeft = false,
  primary,
  canEdit = false,
  selectedStatusType = 'none',
  wrap = false,
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

  const hasIcon = ['final', canEdit ? 'warning' : 'default'].includes(
    selectedStatusType,
  );

  return (
    <div css={containerStyles} ref={reference}>
      <Button
        data-testid="status-button"
        small
        noMargin
        primary={primary}
        onClick={handleClick}
        enabled={canEdit}
        overrideStyles={
          canEdit
            ? statusButtonStyles(selectedStatusType, canEdit, !wrap)
            : statusTagStyles(selectedStatusType, !wrap)
        }
      >
        {hasIcon && (
          <span css={iconStyles(selectedStatusType, canEdit)}>
            {statusIcon(selectedStatusType, canEdit)}
          </span>
        )}
        {buttonChildren(menuShown)}
        {canEdit ? (menuShown ? chevronUpIcon : chevronDownIcon) : null}
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
                    <span css={itemContentStyles(type)}>
                      {['warning', 'final'].includes(type) && (
                        <span css={iconStyles(type, canEdit)}>
                          {statusIcon(type, canEdit)}
                        </span>
                      )}
                      <span>{item}</span>
                    </span>
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
