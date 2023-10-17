import { ComponentProps, useState } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { Label, Paragraph, RadioButton, Tooltip } from '../atoms';
import { steel } from '../colors';

const disabledStyles = css({
  color: steel.rgb,
});

type LabeledRadioButtonProps = {
  readonly title: string;
  readonly hasTooltip?: boolean;
  readonly tooltipText?: string;
  readonly tooltipTextStyles?: SerializedStyles;
  readonly tooltipBubbleStyles?: SerializedStyles;
  readonly tooltipTooltipStyles?: SerializedStyles;
} & ComponentProps<typeof RadioButton>;
const LabeledRadioButton: React.FC<LabeledRadioButtonProps> = ({
  title,
  hasTooltip = false,
  tooltipTextStyles,
  tooltipBubbleStyles,
  tooltipTooltipStyles,
  tooltipText,
  ...radioButtonProps
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Label
      trailing
      forContent={(id) => <RadioButton {...radioButtonProps} id={id} />}
      onHover={() => setShowTooltip(true)}
      onLeave={() => setShowTooltip(false)}
    >
      {radioButtonProps.disabled && hasTooltip ? (
        <Tooltip
          shown={showTooltip}
          overrideBubbleStyles={tooltipBubbleStyles}
          overrideTooltipStyles={tooltipTooltipStyles}
        >
          <Paragraph styles={tooltipTextStyles}>{tooltipText}</Paragraph>
        </Tooltip>
      ) : null}

      <Paragraph
        noMargin
        styles={radioButtonProps.disabled ? disabledStyles : undefined}
      >
        {title}
      </Paragraph>
    </Label>
  );
};

export default LabeledRadioButton;
