import { css } from '@emotion/react';
import { ComponentProps, useRef } from 'react';
import { Button, Label, Paragraph, Tag } from '../atoms';
import { lead } from '../colors';
import { validationMessageStyles } from '../form';
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

const uploadedButtonTagStyles = css({
  display: 'inline-block',
  paddingBottom: `${15 / perRem}em`,
});

const fileSelectionContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
});

type FileUploadResponse = { id: string; url: string; filename: string };

type LabeledFileFieldProps = {
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly hint?: React.ReactNode;
  readonly placeholder?: string;
  readonly currentFile?: FileUploadResponse;
  readonly onRemove?: () => void;
  readonly customValidationMessage?: string;
  readonly customValidation?: (file: File) => boolean;
  readonly handleFileUpload: (file: File) => Promise<void>;
} & Pick<ComponentProps<typeof Button>, 'enabled'>;

const LabeledFileField: React.FC<LabeledFileFieldProps> = ({
  title,
  subtitle,
  description,
  hint,
  placeholder,
  currentFile,
  onRemove,
  enabled,
  customValidationMessage,
  handleFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };
  const handleRemove = () => {
    if (onRemove) {
      onRemove();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  return (
    <div css={containerStyles}>
      <input
        onChange={handleFileChange}
        multiple={false}
        ref={fileInputRef}
        type="file"
        aria-label={placeholder}
        hidden
      />
      <Label
        forContent={(id) => (
          <div css={fileSelectionContainerStyles}>
            {currentFile && (
              <div css={uploadedButtonTagStyles}>
                <Tag key={currentFile.id} onRemove={handleRemove}>
                  {currentFile.filename}
                </Tag>
              </div>
            )}
            <div css={buttonContainerStyles}>
              <Button
                primary
                small
                enabled={!!enabled && !currentFile}
                noMargin
                id={id}
                preventDefault={false}
                onClick={() => !currentFile && fileInputRef.current?.click()}
              >
                <div css={iconStyles}>{plusIcon}</div> Add File
              </Button>
            </div>
          </div>
        )}
      >
        <Paragraph>
          <strong>{title}</strong>
          <span css={subtitleStyles}>{subtitle}</span>
          <br />
          <span css={[descriptionStyles]}>{description}</span>
        </Paragraph>
      </Label>
      {customValidationMessage && (
        <div css={validationMessageStyles}>{customValidationMessage}</div>
      )}
      <div css={hintStyles}>{hint}</div>
    </div>
  );
};

export default LabeledFileField;
