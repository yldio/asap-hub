import { css } from '@emotion/react';
import { Card, Headline3, Link, Paragraph } from '../atoms';
import { paddingStyles } from '../card';
import { perRem } from '../pixels';
import { ExternalLinkIcon } from '../icons';
import { colors } from '..';

interface FormCardProps {
  title: string;
  description?: string;
  link?: string;
  linkLabel?: string;
}

const cardStyles = css({
  paddingTop: `${14 / perRem}em`,
});

const descriptionStyles = css({
  paddingTop: 0,
  paddingBottom: 0,
  'p:first-of-type': {
    marginTop: 0,
    marginBottom: `${10 / perRem}em`,
  },
});

const FormCard: React.FC<FormCardProps> = ({
  children,
  title,
  description,
  link,
  linkLabel,
}) => (
  <Card padding={false} overrideStyles={cardStyles} title={title}>
    <div role="presentation" css={[paddingStyles]}>
      <Headline3 noMargin>{title}</Headline3>
    </div>
    {!!description && (
      <div css={[paddingStyles, descriptionStyles]}>
        <Paragraph accent="lead">
          {description}
          {link && (
            <Link href={link}>
              <span
                css={css({
                  wordBreak: 'break-word',
                  position: 'relative',
                })}
              >
                {linkLabel || link}
                <ExternalLinkIcon
                  size={17}
                  color={colors.pine}
                  style={{
                    position: 'absolute',
                    bottom: '1px',
                  }}
                />
              </span>
            </Link>
          )}
        </Paragraph>
      </div>
    )}
    <div css={[paddingStyles]}>{children}</div>
  </Card>
);

export default FormCard;
