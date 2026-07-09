/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  FocusEventHandler,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from 'react';

import { charcoal, paper } from '../colors';
import { rem } from '../pixels';
import { Portal } from '../utils/portal';

const wrapperStyles = css({
  position: 'relative',
  display: 'flex',
  flex: 1,
});

const gap = 16;
const triangle = 5;

const bubbleStyles = css({
  position: 'fixed',
  transform: 'translateY(-50%)',
  zIndex: 100,
  pointerEvents: 'none',

  backgroundColor: charcoal.rgb,
  color: paper.rgb,
  borderRadius: rem(4),
  padding: `${rem(6)} ${rem(12)}`,
  whiteSpace: 'nowrap',
  fontWeight: 'normal',

  '::before': {
    content: '""',
    position: 'absolute',
    right: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    borderTop: `${rem(triangle)} solid transparent`,
    borderBottom: `${rem(triangle)} solid transparent`,
    borderRight: `${rem(triangle)} solid ${charcoal.rgb}`,
  },
});

type Coords = { left: number; top: number };

type RailTooltipProps = {
  readonly label: ReactNode;
  readonly enabled?: boolean;
} & PropsWithChildren;

const RailTooltip: React.FC<RailTooltipProps> = ({
  label,
  enabled = true,
  children,
}) => {
  const [coords, setCoords] = useState<Coords | null>(null);

  const show = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setCoords({ left: rect.right + gap, top: rect.top + rect.height / 2 });
  }, []);
  const hide = useCallback(() => setCoords(null), []);

  const onFocus = useCallback<FocusEventHandler<HTMLSpanElement>>(
    (event) => {
      if (event.currentTarget.matches(':focus-visible')) {
        show(event.currentTarget);
      }
    },
    [show],
  );

  return (
    <span
      css={wrapperStyles}
      onMouseEnter={enabled ? (event) => show(event.currentTarget) : undefined}
      onMouseLeave={enabled ? hide : undefined}
      onFocus={enabled ? onFocus : undefined}
      onBlur={enabled ? hide : undefined}
    >
      {children}
      {enabled && coords && (
        <Portal>
          <span role="tooltip" css={bubbleStyles} style={coords}>
            {label}
          </span>
        </Portal>
      )}
    </span>
  );
};

export default RailTooltip;
