import { gp2 } from '@asap-hub/model';
import {
  ExternalLink,
  Paragraph,
  pixels,
  Subtitle,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';

const { rem } = pixels;

const descriptionBlockStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
});

type GuideDescriptionProps = {
  blocks: gp2.GuideBlockDataObject[];
};

const GuideDescription = ({ blocks }: GuideDescriptionProps) => (
  <div css={descriptionBlockStyles}>
    {blocks.map(
      ({
        bodyText,
        title,
        linkText,
        linkUrl,
        id,
      }: gp2.GuideBlockDataObject) => (
        <article key={id}>
          {title && <Subtitle>{title}</Subtitle>}
          <Paragraph>{bodyText}</Paragraph>
          {linkUrl && (
            <ExternalLink href={linkUrl} label={linkText || 'External Link'} />
          )}
        </article>
      ),
    )}
  </div>
);
export default GuideDescription;
