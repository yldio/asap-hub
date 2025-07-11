import { ToastContext } from '@asap-hub/react-context';
import { css } from '@emotion/react';
import { ReactNode, useContext } from 'react';
import { Button } from '../atoms';
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

const exportIconStyles = css({ display: 'flex' });
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
      {buttonGroup.map((button) => (
        <Button
          key={button.buttonText}
          noMargin
          small
          onClick={() =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            button.exportResults!().catch(() => {
              toast(button.errorMessage);
            })
          }
          overrideStyles={exportButtonStyles}
        >
          <>
            <div css={exportIconStyles}>{ExportIcon}</div>
            {button.buttonText}
          </>
        </Button>
      ))}
    </span>
  ) : null;
};

export default ExportButton;
