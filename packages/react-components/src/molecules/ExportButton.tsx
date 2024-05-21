import { ToastContext } from '@asap-hub/react-context';
import { css } from '@emotion/react';
import { useContext } from 'react';
import { Button } from '../atoms';
import { ExportIcon } from '../icons';
import { mobileScreen, rem, tabletScreen } from '../pixels';

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
  paddingRight: rem(15),

  [`@media (max-width: ${tabletScreen.min}px)`]: {
    width: '100%',
  },

  [`@media (min-width:${tabletScreen.min}px) and (max-width: ${mobileScreen.max}px)`]:
    {
      minWidth: 'auto',
    },
});

const exportIconStyles = css({ display: 'flex' });
type ExportButtonProps = {
  readonly exportResults?: () => Promise<void>;
};

const ExportButton: React.FC<ExportButtonProps> = ({ exportResults }) => {
  const toast = useContext(ToastContext);
  return exportResults ? (
    <span css={exportSectionStyles}>
      <strong>Export as:</strong>
      <Button
        noMargin
        small
        onClick={() =>
          exportResults().catch((e) => {
            console.log(e);
            toast('There was an issue exporting to CSV. Please try again.');
          })
        }
        overrideStyles={exportButtonStyles}
      >
        <>
          <div css={exportIconStyles}>{ExportIcon}</div>
          CSV
        </>
      </Button>
    </span>
  ) : null;
};

export default ExportButton;
