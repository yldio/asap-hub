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

import { rem, mobileScreen, formTargetWidth } from '../pixels';

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
  maxWidth: rem(formTargetWidth),
});

const menuContainerStyles = css({
  position: 'absolute',
  display: 'none',
  overflow: 'hidden',
  zIndex: 1,
  width: rem(250),
  top: rem(8),
  left: 0,
  backgroundColor: paper.rgb,
  border: `1px solid ${steel.rgb}`,
  boxShadow: `0 2px 6px 0 ${colorWithTransparency(tin, 0.34).rgba}`,
  flexDirection: 'column',
  padding: `${rem(6)} 0`,
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
    columnGap: rem(15),
    padding: `${rem(4)} ${rem(14)}`,
    fontWeight: 'normal',
    fontSize: '14px',
    margin: `${rem(8)} ${rem(16)} !important`,
    backgroundColor: info100.rgba,
    color: info500.rgba,
    borderRadius: rem(24),
    alignSelf: 'initial',
    maxWidth: 'fit-content',
    ...(type === 'warning' || type === 'final'
      ? {
          color: type === 'warning' ? warning500.rgba : success500.rgba,
          backgroundColor:
            type === 'warning' ? warning100.rgba : success100.rgba,
          columnGap: rem(6),
          padding: `${rem(4)} ${rem(16)} ${rem(4)} ${rem(8)}`,
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
    borderRadius: rem(24),
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
    paddingLeft: rem(16),
    paddingRight: `${rem(8)} !important`,
    ...(noWrap ? { textWrap: 'nowrap' } : {}),
    maxWidth: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    gap: rem(8),
  });

export const statusTagStyles = (type: StatusType, noWrap: boolean = true) =>
  css({
    borderRadius: rem(24),
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
    paddingLeft: rem(16),
    paddingRight: rem(16),
    ...(noWrap ? { textWrap: 'nowrap' } : {}),
    maxWidth: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    gap: rem(8),
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
