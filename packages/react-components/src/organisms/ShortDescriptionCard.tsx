import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { Button } from '../atoms';
import { aiGenerate } from '../icons';
import { LabeledTextArea } from '../molecules';
import { rem } from '../pixels';

type ShortDescriptionCardProps = Omit<
  ComponentProps<typeof LabeledTextArea>,
  'title' | 'subtitle' | 'getValidationMessage'
> & {
  getShortDescription: () => Promise<string>;
  buttonEnabled?: boolean;
};

const iconStyles = (isGenerateButtonEnabled: boolean) =>
  css({
    display: 'flex',
    marginRight: rem(8),
    path: {
      fill: isGenerateButtonEnabled ? '#FFFFFF' : '#4D646B',
    },
  });

const ShortDescriptionCard: React.FC<ShortDescriptionCardProps> = ({
  enabled,
  buttonEnabled = true,
  onChange,
  getShortDescription,
  ...props
}) => {
  const [generatingStatus, setGeneratingStatus] = useState<
    'initial' | 'isGenerating' | 'isRegenerating' | 'hasGenerated'
  >('initial');

  const handleGenerate = async () => {
    setGeneratingStatus(
      generatingStatus === 'initial' ? 'isGenerating' : 'isRegenerating',
    );
    const shortDescription = await getShortDescription();
    if (onChange) {
      onChange(shortDescription);
    }
    setGeneratingStatus('hasGenerated');
  };

  const isGenerateButtonEnabled = Boolean(
    buttonEnabled &&
      enabled &&
      generatingStatus !== 'isGenerating' &&
      generatingStatus !== 'isRegenerating',
  );

  return (
    <LabeledTextArea
      title="Short Description"
      subtitle="(required)"
      tip="Add a short description based on what you wrote on the
    description field above."
      getValidationMessage={() => 'Please enter a short description'}
      onChange={onChange}
      required
      {...props}
      enabled={
        enabled &&
        generatingStatus !== 'isGenerating' &&
        generatingStatus !== 'isRegenerating'
      }
      maxLength={250}
      extras={
        <Button
          primary
          noMargin
          small
          enabled={isGenerateButtonEnabled}
          onClick={handleGenerate}
        >
          <span css={iconStyles(isGenerateButtonEnabled)}>{aiGenerate}</span>
          {generatingStatus === 'initial' || generatingStatus === 'isGenerating'
            ? 'Generate'
            : 'Regenerate'}
        </Button>
      }
    />
  );
};
export default ShortDescriptionCard;
