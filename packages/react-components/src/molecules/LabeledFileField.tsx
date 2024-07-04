import { css } from '@emotion/react';
import { ComponentProps, useRef } from 'react';
import { Button, Label, Paragraph } from '../atoms';
import { lead } from '../colors';
import { plusIcon } from '../icons';
import { perRem } from '../pixels';

const containerStyles = css({
  paddingBottom: `${18 / perRem}em`,
});

const buttonContainerStyles = css({
  display: 'block',
});

const descriptionStyles = css({
  color: lead.rgb,
});

const hintStyles = css({
  ':empty': {
    display: 'none',
  },
  paddingTop: `${6 / perRem}em`,

  color: lead.rgb,
});

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

const iconStyles = css({
  display: 'flex',
  marginRight: `${8 / perRem}em`,
});

type LabeledFileFieldProps = {
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly hint?: React.ReactNode;
  readonly value?: string;
  readonly onUpload?: (fileId: string) => void;
  readonly customValidationMessage?: string;
  readonly customValidation?: (file: File) => boolean;
  readonly handleFileUpload?: (file: File) => Promise<string>;
} & Pick<ComponentProps<typeof Button>, 'enabled'>;

const LabeledFileField: React.FC<LabeledFileFieldProps> = ({
  title,
  subtitle,
  description,
  hint,
  value,
  onUpload,
  enabled,
  customValidation,
  customValidationMessage,
  handleFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (customValidation && !customValidation(file)) {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      let fileUrl: string | undefined;

      if (handleFileUpload) {
        fileUrl = await handleFileUpload(file);
      }

      if (onUpload) {
        onUpload(fileUrl || file.name);
      }
    }
  };
  return (
    <div css={containerStyles}>
      <Label
        forContent={(id) =>
          (!value && (
            <>
              <div css={buttonContainerStyles}>
                <Button
                  primary
                  enabled={enabled}
                  noMargin
                  id={id}
                  preventDefault={false}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <>
                    <div css={iconStyles}>{plusIcon}</div> Add File
                  </>
                </Button>
                {customValidationMessage}
                <input
                  onChange={handleFileChange}
                  multiple={false}
                  ref={fileInputRef!}
                  type="file"
                  hidden
                />
              </div>
            </>
          )) || <span>"{value}"</span>
        }
      >
        <Paragraph>
          <strong>{title}</strong>
          <span css={subtitleStyles}>{subtitle}</span>
          <br />
          <span css={[descriptionStyles]}>{description}</span>
        </Paragraph>
      </Label>
      <div css={hintStyles}>{hint}</div>
    </div>
  );
};

export default LabeledFileField;
