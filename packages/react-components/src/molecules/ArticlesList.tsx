import { FC, useState } from 'react';
import { css } from '@emotion/react';

import { Button, Link } from '../atoms';
import { article as articleIcon, minusRectIcon, plusRectIcon } from '../icons';
import { rem } from '../pixels';
import { neutral900 } from '../colors';

export type ArticleItem = {
  readonly id: string;
  readonly title: string;
  readonly href: string;
};

const headerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(16),
  marginBottom: rem(8),
});

const iconButtonStyles = css({
  display: 'inline-flex',
  padding: 0,
  minWidth: 'auto',
});

const titleStyles = css({
  fontSize: rem(17),
  color: neutral900.rgb,
  lineHeight: rem(26),
});

const listWrapperStyles = (maxHeight: string, maxWidth?: string) =>
  css({
    maxHeight,
    ...(maxWidth ? { maxWidth } : {}),
    paddingRight: rem(4),
    overflowY: 'auto',
    overflowX: 'hidden',
  });

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  marginLeft: rem(36),
});

const itemStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  padding: `${rem(4)} 0`,
});

const itemIconStyles = css({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  width: rem(24),
  height: rem(24),
});

const itemTextContainerStyles = css({
  flex: 1,
  minWidth: 0,
  paddingRight: rem(12),
});

const itemLinkStyles = css({
  fontSize: rem(17),
  lineHeight: rem(24),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block',
});

export type ArticlesListProps = {
  readonly articles: ReadonlyArray<ArticleItem>;
  readonly initiallyExpanded?: boolean;
  readonly listMaxHeight?: string;
  readonly maxWidth?: string;
};

const ArticlesList: FC<ArticlesListProps> = ({
  articles,
  initiallyExpanded = true,
  listMaxHeight = rem(240),
  maxWidth = rem(408),
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const count = articles.length;

  return (
    <div>
      <div css={headerStyles}>
        <Button
          aria-label={expanded ? 'Collapse articles' : 'Expand articles'}
          linkStyle
          onClick={() => setExpanded(!expanded)}
          overrideStyles={iconButtonStyles}
        >
          <span>{expanded ? minusRectIcon : plusRectIcon}</span>
        </Button>
        <span css={titleStyles}>Articles ({count})</span>
      </div>
      {expanded && (
        <div css={listWrapperStyles(listMaxHeight, maxWidth)}>
          <ul css={listStyles}>
            {articles.map(({ id, title, href }) => (
              <li key={id} css={itemStyles}>
                <span css={itemIconStyles} aria-hidden>
                  {articleIcon}
                </span>
                <span css={itemTextContainerStyles}>
                  <Link href={href}>
                    <span css={itemLinkStyles}>{title}</span>
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;
