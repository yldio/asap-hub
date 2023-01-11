import { Card, Headline3, Link, pixels } from '@asap-hub/react-components';

import { css } from '@emotion/react';
import { addIcon, editIcon } from '../icons';
import { mobileQuery } from '../layout';

type EditableCardProps = {
  title: string;
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
  optional = false,
  edit = true,
  children,
}) => (
  <Card>
    <article css={containerStyles}>
      <div css={[{ gridArea: 'headline' }]}>
        <Headline3>{title}</Headline3>
      </div>
      {editHref && (
        <div css={[{ gridArea: 'edit' }]}>
          <Link href={editHref} buttonStyle noMargin small fullWidth>
            {edit ? 'Edit' : optional ? 'Optional' : 'Required'}{' '}
            {edit ? editIcon : addIcon}
          </Link>
        </div>
      )}
      <div css={[{ gridArea: 'content' }]}>{children}</div>
    </article>
  </Card>
);

export default EditableCard;
