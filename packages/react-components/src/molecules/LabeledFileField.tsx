import { css } from '@emotion/react';
import { ComponentProps, useRef, useState } from 'react';
import Lottie from 'react-lottie';
import { Button, Label, Paragraph, Tag } from '../atoms';
import { lead } from '../colors';
import { validationMessageStyles } from '../form';
import { plusIcon } from '../icons';
import { perRem } from '../pixels';
import loading from '../lotties/loading.json';

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
  alignItems: 'flex-start',
});

type FileUploadResponse = { id: string; url: string; filename: string };

type LabeledFileFieldProps = {
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly hint?: React.ReactNode;
  readonly placeholder?: string;
  readonly maxFiles?: number;
  readonly currentFiles?: FileUploadResponse[];
  readonly onRemove?: (id?: string) => void;
  readonly customValidationMessage?: string;
  readonly customValidation?: (file: File) => boolean;
  readonly handleFileUpload: (file: File) => Promise<void>;
  readonly accept?: string;
  readonly tagEnabled?: boolean;
  readonly noPadding?: boolean;
} & Pick<ComponentProps<typeof Button>, 'enabled'>;

const LabeledFileField: React.FC<LabeledFileFieldProps> = ({
  title,
  subtitle,
  description,
  hint,
  placeholder,
  maxFiles = 1,
  currentFiles,
  accept,
  onRemove,
  enabled,
  customValidationMessage,
  handleFileUpload,
  tagEnabled = true,
  noPadding = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsSubmitting(true);
      await handleFileUpload(file);
      setIsSubmitting(false);
    }
  };
  const handleRemove = (id?: string) => {
    if (onRemove) {
      onRemove(id);
    }
  };
  const canUploadFile = !currentFiles || currentFiles.length < maxFiles;

  return (
    <div css={[containerStyles, noPadding && { paddingBottom: 0 }]}>
      <input
        onChange={handleFileChange}
        multiple={maxFiles > 1}
        ref={fileInputRef}
        type="file"
        aria-label={placeholder}
        accept={accept}
        value=""
        hidden
      />
      <Label
        forContent={(id) => (
          <>
            <div style={{ width: '100%' }} />
            <div css={fileSelectionContainerStyles}>
              {currentFiles &&
                currentFiles.map((file) => (
                  <div css={uploadedButtonTagStyles} key={file.id}>
                    <Tag
                      onRemove={() => handleRemove(file.id)}
                      enabled={tagEnabled}
                    >
                      {file.filename}
                    </Tag>
                  </div>
                ))}
              <div css={buttonContainerStyles}>
                <Button
                  submit={false}
                  primary
                  small
                  enabled={!!enabled && canUploadFile}
                  noMargin
                  id={id}
                  preventDefault={false}
                  onClick={() => canUploadFile && fileInputRef.current?.click()}
                >
                  {isSubmitting ? (
                    <Lottie
                      options={{
                        loop: true,
                        autoplay: true,
                        animationData: loading,
                        rendererSettings: {
                          preserveAspectRatio: 'xMidYMid slice',
                        },
                      }}
                      height={24}
                      width={24}
                      style={{ marginRight: '8px' }}
                    />
                  ) : (
                    <div css={iconStyles}>{plusIcon}</div>
                  )}
                  Add File
                </Button>
              </div>
            </div>
          </>
        )}
      >
        <Paragraph noMargin styles={css({ paddingBottom: 16 })}>
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
