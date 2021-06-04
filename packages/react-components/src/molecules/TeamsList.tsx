import { css } from '@emotion/react';
import { network } from '@asap-hub/routing';

import { Divider, Link } from '../atoms';
import { perRem } from '../pixels';
import { teamIcon } from '../icons';
import { lead } from '../colors';
import { themeStyles as linkStyles } from '../atoms/Link';

const containerStyles = css({
  display: 'grid',
  gridColumnGap: `${12 / perRem}em`,
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
  paddingBottom: `${6 / perRem}em`,
  overflow: 'hidden',
});

const inlinePaddingStyles = css({
  'li:not(:last-of-type) > &': {
    paddingRight: `${6 / perRem}em`,
  },
});

const teamInlineStyles = css(inlinePaddingStyles, linkStyles.light, {
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

interface TeamsListProps {
  readonly teams: ReadonlyArray<{ id: string; displayName: string }>;
  readonly inline?: boolean;
  readonly max?: number;
}
const TeamsList: React.FC<TeamsListProps> = ({
  teams,
  inline = false,
  max = Number.POSITIVE_INFINITY,
}) => (
  <div
    css={[
      containerStyles,
      inline && containerInlineStyles,
      teams.length > max && containerSummarizedStyles,
    ]}
  >
    {((inline && !!teams.length) || teams.length > max) && teamIcon}
    {teams.length > max ? (
      <span css={{ color: lead.rgb }}>
        {teams.length} Team{teams.length === 1 ? '' : 's'}
      </span>
    ) : (
      <ul css={[listStyles, inline ? listInlineStyles : listBlockStyles]}>
        {teams.flatMap(({ id, displayName }, i) => (
          <li
            css={inline ? itemInlineStyles : itemBlockStyles}
            key={`sep-${i}`}
          >
            {inline || teamIcon}
            <div css={inline ? teamInlineStyles : undefined}>
              <Link href={network({}).teams({}).team({ teamId: id }).$}>
                Team {displayName}
              </Link>
              {inline && <span css={bulletStyles}>·</span>}
            </div>
            <div css={dividerStyles}>{inline || <Divider />}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default TeamsList;
