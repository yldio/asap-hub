import { css } from '@emotion/react';
import { Avatar, Button, Link, Paragraph } from '../atoms';
import { lead } from '../colors';
import { binIcon, uploadIcon } from '../icons';
import { rem } from '../pixels';

const avatarSize = 90;

const avatarStyles = css({
  width: rem(avatarSize),
  height: rem(avatarSize),
});

const buttonRowStyles = css({
  display: 'flex',
  gap: rem(12),
  marginTop: rem(12),
});

const buttonContentStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
});

const subtitleStyles = css({
  paddingLeft: rem(6),
  color: lead.rgb,
});

type EditUserAvatarProps = {
  readonly avatarUrl?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly onImageSelect: (file: File) => void;
  readonly onImageRemove: () => void;
  readonly enabled?: boolean;
};

const EditUserAvatar: React.FC<EditUserAvatarProps> = ({
  avatarUrl,
  firstName,
  lastName,
  onImageSelect,
  onImageRemove,
  enabled = true,
}) => (
  <div>
    <Paragraph noMargin styles={css({ paddingBottom: rem(12) })}>
      <strong>Profile Photo</strong>
      <span css={subtitleStyles}>(optional)</span>
    </Paragraph>
    <Avatar
      imageUrl={avatarUrl}
      firstName={firstName}
      lastName={lastName}
      overrideStyles={avatarStyles}
    />
    <div css={buttonRowStyles}>
      <label>
        <Link
          primary
          small
          buttonStyle
          noMargin
          href={undefined}
          label="Upload profile photo"
          enabled={enabled}
        >
          <span css={buttonContentStyles}>
            {uploadIcon}
            Upload
          </span>
          <input
            disabled={!enabled}
            type="file"
            accept="image/x-png,image/jpeg"
            aria-label="Upload profile photo"
            onChange={(event) =>
              event.target.files?.length &&
              event.target.files[0] &&
              onImageSelect(event.target.files[0])
            }
            css={{ display: 'none' }}
          />
        </Link>
      </label>
      {avatarUrl && (
        <Button small noMargin enabled={enabled} onClick={onImageRemove}>
          <span css={buttonContentStyles}>
            {binIcon}
            Remove
          </span>
        </Button>
      )}
    </div>
  </div>
);

export default EditUserAvatar;
