import { ToastContext } from '@asap-hub/react-context';
import { css, keyframes } from '@emotion/react';
import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { Button } from '../atoms';
import { lead, neutral500 } from '../colors';
import { ExportIcon } from '../icons';
import { mobileScreen, rem, tabletScreen } from '../pixels';
import TooltipInfo from './TooltipInfo';

const exportSectionStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(15),

  [`@media (max-width: ${tabletScreen.min}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: rem(24),
    width: '100%',
  },
});

const exportButtonStyles = css({
  gap: rem(8),
  height: '100%',
  alignItems: 'center',
  padding: rem(9),
  paddingRight: rem(15),
  [`@media (max-width: ${tabletScreen.min}px)`]: {
    width: '100%',
  },

  [`@media (min-width:${tabletScreen.min}px) and (max-width: ${mobileScreen.max}px)`]:
    {
      minWidth: 'auto',
    },
});

const infoWrapperStyle = css({
  verticalAlign: 'middle',
});

const tooltipStyle = css({
  textAlign: 'left',
});

// Match ExportIcon's intrinsic 18×18 footprint so swapping in the spinner
// doesn't reflow the button width.
const exportIconStyles = css({
  display: 'flex',
  width: rem(18),
  height: rem(18),
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const spin = keyframes`
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
`;

// Dark-grey spinner that matches secondary button text/icon colour (lead).
const exportSpinnerStyles = css({
  display: 'block',
  boxSizing: 'border-box',
  width: rem(16),
  height: rem(16),
  border: `${rem(2)} solid ${neutral500.rgb}`,
  borderTopColor: lead.rgb,
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
  flexShrink: 0,
});
type ExportButtonProps = {
  readonly exportResults?: () => Promise<void>;
  readonly buttons?: Array<{
    buttonText: string;
    errorMessage: string;
    exportResults?: () => Promise<void>;
  }>;
  readonly info?: ReactNode;
};

const ExportButton: React.FC<ExportButtonProps> = ({
  exportResults,
  info,
  buttons,
}) => {
  const defaultButton = {
    exportResults,
    buttonText: 'CSV',
    errorMessage: 'There was an issue exporting to CSV. Please try again.',
  };
  const buttonGroup = (buttons?.length ? buttons : [defaultButton]).filter(
    (button) => !!button.exportResults,
  );

  const toast = useContext(ToastContext);
  // Per-button loading state keyed by buttonText so each button shows its
  // spinner independently while exports may take a while to fetch data.
  const [loadingButtons, setLoadingButtons] = useState<
    Readonly<Record<string, boolean>>
  >({});
  // Track mount so we don't schedule a state update after the component has
  // been unmounted (e.g. tests that finish the click then unmount without
  // awaiting the export's resolution).
  const mountedRef = useRef(true);
  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );
  const setLoading = useCallback((buttonText: string, value: boolean) => {
    if (!mountedRef.current) return;
    setLoadingButtons((previous) => ({
      ...previous,
      [buttonText]: value,
    }));
  }, []);

  return buttonGroup.length ? (
    <span css={exportSectionStyles}>
      <strong>
        Download:
        {info ? (
          <TooltipInfo
            overrideWrapperStyles={infoWrapperStyle}
            overrideTooltipStyles={tooltipStyle}
          >
            {info}
          </TooltipInfo>
        ) : null}
      </strong>
      {buttonGroup.map((button) => {
        const isLoading = loadingButtons[button.buttonText] === true;
        return (
          <Button
            key={button.buttonText}
            noMargin
            small
            enabled={!isLoading}
            onClick={async () => {
              if (isLoading) return;
              // flushSync forces React to paint the loading state before the
              // export starts; otherwise React 18 automatic batching can
              // group setLoading(true) and setLoading(false) into a single
              // render and the spinner never appears.
              flushSync(() => {
                setLoading(button.buttonText, true);
              });
              const startedAt = Date.now();
              try {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                await button.exportResults!();
              } catch {
                toast(button.errorMessage);
              } finally {
                // Keep the spinner visible for at least 250ms even on very
                // fast exports so it doesn't flicker imperceptibly.
                const elapsed = Date.now() - startedAt;
                const remaining = Math.max(0, 250 - elapsed);
                if (remaining > 0) {
                  await new Promise<void>((resolve) => {
                    setTimeout(resolve, remaining);
                  });
                }
                setLoading(button.buttonText, false);
              }
            }}
            overrideStyles={exportButtonStyles}
          >
            <>
              <div css={exportIconStyles}>
                {isLoading ? (
                  <div
                    css={exportSpinnerStyles}
                    role="progressbar"
                    aria-label="Exporting"
                  />
                ) : (
                  ExportIcon
                )}
              </div>
              {button.buttonText}
            </>
          </Button>
        );
      })}
    </span>
  ) : null;
};

export default ExportButton;
