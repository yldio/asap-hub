import { css } from '@emotion/react';
import { network } from '@asap-hub/routing';

import { Avatar, Divider, Link } from '../atoms';
import { perRem } from '../pixels';
import { lead } from '../colors';
import { labIcon, teamIcon } from '../icons';

const containerStyles = css({
  display: 'grid',
  gridColumnGap: `${12 / perRem}em`,
  color: lead.rgb,
});
const containerInlineStyles = css({
  gridTemplateColumns: 'max-content 1fr',
});
const containerSummarizedStyles = css({
  gridTemplateColumns: 'max-content max-content',
});

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,

  overflow: 'hidden',
});
const listBlockStyles = css({
  padding: `${12 / perRem}em 0`,
  display: 'grid',
  gridRowGap: `${12 / perRem}em`,
});
const listInlineStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const itemBlockStyles = css({
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  gridGap: `${12 / perRem}em`,
});
const itemInlineStyles = css({
  fontSize: `${17 / perRem}em`,
  paddingBottom: `${6 / perRem}em`,
  overflow: 'hidden',
});

const inlinePaddingStyles = css({
  'li:not(:last-of-type) > &': {
    paddingRight: `${6 / perRem}em`,
  },
});

const associationInlineStyles = css(inlinePaddingStyles, {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});
const dividerStyles = css({
  gridColumn: '1 / -1',
  'li:last-of-type > &': {
    display: 'none',
  },
});
const bulletStyles = css({
  color: lead.rgb,
  paddingLeft: `${6 / perRem}em`,
  'li:last-of-type > * > &': {
    display: 'none',
  },
});

const moreStyles = css({
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: 'min-content 1fr',
  gridColumnGap: `${6 / perRem}em`,
  alignItems: 'center',
});
const avatarStyles = css({
  fontSize: `${20 / perRem}em`,
});
const nameStyles = css({
  fontSize: `${17 / perRem}em`,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

interface AssociationListProps {
  readonly associations: ReadonlyArray<{
    displayName: string;
    id: string;
  }>;
  readonly type: 'Team' | 'Lab';
  readonly inline?: boolean;
  readonly max?: number;
  readonly more?: number;
}
const AssociationList: React.FC<AssociationListProps> = ({
  associations,
  type,
  inline = false,
  max = Number.POSITIVE_INFINITY,
  more,
}) => {
  const icon = type === 'Team' ? teamIcon : labIcon;
  const limitExceeded = associations.length > max;
  return associations.length ? (
    <div
      css={[
        containerStyles,
        inline && containerInlineStyles,
        limitExceeded && containerSummarizedStyles,
      ]}
    >
      {inline && icon}
      {limitExceeded ? (
        <>
          {associations.length} {type}
          {associations.length === 1 ? '' : 's'}
        </>
      ) : (
        <ul css={[listStyles, inline ? listInlineStyles : listBlockStyles]}>
          {associations.map(({ displayName, id }, i) => (
            <li
              css={inline ? itemInlineStyles : itemBlockStyles}
              key={`sep-${i}`}
            >
              {inline || icon}
              <div css={inline ? associationInlineStyles : undefined}>
                {type === 'Team' ? (
                  <Link href={network({}).teams({}).team({ teamId: id }).$}>
                    {type} {displayName}
                  </Link>
                ) : (
                  <>
                    {displayName} {type}
                  </>
                )}

                {inline && <span css={bulletStyles}>·</span>}
              </div>
              {inline || (
                <div css={dividerStyles}>
                  <Divider />
                </div>
              )}
            </li>
          ))}
          {more && (
            <li>
              <div css={moreStyles}>
                <div css={avatarStyles}>
                  <Avatar placeholder={`+${more}`} />
                </div>
                <span css={nameStyles}>
                  {type}
                  {more === 1 ? '' : 's'}
                </span>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  ) : null;
};

export default AssociationList;
