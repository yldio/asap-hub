import { ToastContext } from '@asap-hub/react-context';
import { css, keyframes } from '@emotion/react';
import { ReactNode, useCallback, useContext, useState } from 'react';
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
  width: rem(16),
  height: rem(16),
  border: `${rem(2)} solid ${neutral500.rgb}`,
  borderTop: `${rem(2)} solid ${lead.rgb}`,
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
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
  const setLoading = useCallback(
    (buttonText: string, value: boolean) =>
      setLoadingButtons((previous) => ({
        ...previous,
        [buttonText]: value,
      })),
    [],
  );

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
            onClick={() => {
              if (isLoading) return;
              setLoading(button.buttonText, true);
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              void button.exportResults!()
                .catch(() => {
                  toast(button.errorMessage);
                })
                .finally(() => {
                  setLoading(button.buttonText, false);
                });
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
