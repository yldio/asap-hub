import { css, SerializedStyles } from '@emotion/react';
import { useEffect, useState } from 'react';
import copyIcon from '../icons/copy-icon';
import { secondaryStyles } from '../button';
import { rem } from '../pixels';
import { Tooltip } from '.';

const copyButtonStyles = css({
  padding: rem(10),
  margin: 0,
  outline: 'none',
  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderWidth: rem(1),
  borderRadius: rem(4),
  cursor: 'pointer',
});

type CopyButtonProps = {
  hoverTooltipText: string;
  clickTooltipText: string;
  onClick: () => void;
  readonly overrideStyles?: SerializedStyles;
};

const CopyButton: React.FC<CopyButtonProps> = ({
  onClick,
  hoverTooltipText,
  clickTooltipText,
  overrideStyles,
}) => {
  const [tooltipClickShown, setTooltipClickShown] = useState<boolean>(false);
  const [tooltipHoverShown, setTooltipHoverShown] = useState<boolean>(false);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (tooltipClickShown) {
      timer = setTimeout(() => {
        setTooltipClickShown(false);
      }, 1000);
    }
    return () => timer && clearTimeout(timer);
  }, [tooltipClickShown, setTooltipClickShown]);

  return (
    <button
      css={[secondaryStyles, copyButtonStyles, overrideStyles]}
      onClick={async () => {
        onClick();
        setTooltipHoverShown(false);
        setTooltipClickShown(true);
      }}
      onMouseOver={() => {
        setTooltipHoverShown(true);
      }}
      onMouseOut={() => {
        setTooltipHoverShown(false);
      }}
    >
      <Tooltip maxContent bottom={rem(24)} shown={tooltipClickShown}>
        {clickTooltipText}
      </Tooltip>
      <Tooltip maxContent bottom={rem(24)} shown={tooltipHoverShown}>
        {hoverTooltipText}
      </Tooltip>
      <div
        css={css({
          width: rem(16),
          height: rem(16),
        })}
      >
        {copyIcon}
      </div>
    </button>
  );
};

export default CopyButton;
