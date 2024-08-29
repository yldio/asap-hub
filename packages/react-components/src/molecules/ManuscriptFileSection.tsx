import { ManuscriptFileResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { Subtitle, Link, Divider } from '..';
import { downloadIcon, linkIcon } from '../icons';
import { rem } from '../pixels';

type ManuscriptFileSectionProps = Pick<
  ManuscriptFileResponse,
  'filename' | 'url'
>;

const fileContainerStyles = css({
  display: 'flex',
  gap: rem(12),
  alignItems: 'center',
});

const fileDividerStyles = css({
  display: 'block',
  margin: `${rem(4)} 0`,
});

const downloadButtonStyles = css({
  marginLeft: 'auto',
  flexGrow: 0,
  alignSelf: 'center',
});

const ManuscriptFileSection: React.FC<ManuscriptFileSectionProps> = ({
  filename,
  url,
}) => (
  <>
    {filename && url && (
      <>
        <span css={fileDividerStyles}>
          <Divider />
        </span>
        <div css={fileContainerStyles}>
          {linkIcon}
          <Subtitle>{filename}</Subtitle>
          <div css={css(downloadButtonStyles)}>
            <Link href={url} primary noMargin small buttonStyle>
              {downloadIcon} Download
            </Link>
          </div>
        </div>
      </>
    )}
  </>
);

export default ManuscriptFileSection;
