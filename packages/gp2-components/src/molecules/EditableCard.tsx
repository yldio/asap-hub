import {
  Card,
  Headline3,
  Link,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { addIcon, editIcon } from '../icons';
import { mobileQuery } from '../layout';

type EditableCardProps = {
  title: string;
  subtitle?: ReactNode;
  edit?: boolean;
  editHref?: string;
  optional?: boolean;
};
const { rem } = pixels;

const containerStyles = css({
  display: 'grid',
  grid: `
    "headline edit" max-content
    "content content" auto
    /auto min-content
    `,
  columnGap: rem(32),
  rowGap: rem(12),
  [mobileQuery]: {
    grid: `
    "edit" auto
    "headline" auto
    "content" auto`,
  },
});

const EditableCard: React.FC<EditableCardProps> = ({
  title,
  editHref,
  subtitle,
  optional = false,
  edit = true,
  children,
}) => (
  <Card>
    <article css={containerStyles}>
      <div css={[{ gridArea: 'headline' }]}>
        <Headline3 noMargin>{title}</Headline3>
        {subtitle && (
          <div css={css({ marginTop: rem(24) })}>
            <Paragraph noMargin accent="lead">
              {subtitle}
            </Paragraph>
          </div>
        )}
      </div>
      {editHref && (
        <div css={[{ gridArea: 'edit' }]}>
          <Link
            href={editHref}
            buttonStyle
            noMargin
            small
            fullWidth
            overrideStyles={css({ padding: `${rem(5)} ${rem(14)}` })}
          >
            <div
              css={{
                display: 'flex',
                flexDirection: 'row',
                gap: rem(8),
              }}
            >
              {edit ? 'Edit' : optional ? 'Optional' : 'Required'}
              {edit ? editIcon : addIcon}
            </div>
          </Link>
        </div>
      )}
      <div css={[{ gridArea: 'content' }]}>{children}</div>
    </article>
  </Card>
);

export default EditableCard;
