import { FC, useEffect, useState } from 'react';
import { css } from '@emotion/react';

import type { ArticleItem } from '@asap-hub/model';

import { Button, Link } from '../atoms';
import { article as articleIcon, minusRectIcon, plusRectIcon } from '../icons';
import { rem } from '../pixels';
import { neutral900 } from '../colors';
import { noop } from '../utils';

const headerStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: rem(8),
  marginBottom: rem(8),
});

const separatorStyles = css({
  color: neutral900.rgb,
  fontSize: rem(17),
});

const iconButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  padding: 0,
  minWidth: 'auto',
  gap: rem(16),
  textDecoration: 'none',
  ':hover, :active, :focus': {
    textDecoration: 'none',
  },
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

const iconStyles = css({
  display: 'flex',
});

export type ArticlesListProps = {
  readonly aimId: string;
  readonly articlesCount?: number;
  readonly initiallyExpanded?: boolean;
  readonly listMaxHeight?: string;
  readonly maxWidth?: string;
  readonly fetchArticles: (
    aimId: string,
  ) => Promise<ReadonlyArray<ArticleItem>>;
};

const ArticlesList: FC<ArticlesListProps> = ({
  initiallyExpanded = false,
  listMaxHeight = rem(240),
  maxWidth = rem(408),
  articlesCount = 0,
  aimId,
  fetchArticles,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [articles, setArticles] = useState<ReadonlyArray<ArticleItem>>([]);

  useEffect(() => {
    if (initiallyExpanded && articlesCount > 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchArticles(aimId).then(setArticles);
    }
  }, [aimId, initiallyExpanded, fetchArticles, articlesCount]);

  return (
    <div>
      <div css={headerStyles}>
        <Button
          id={`articles-list-button-${aimId}`}
          aria-label={expanded ? 'Collapse articles' : 'Expand articles'}
          linkStyle
          onClick={async () => {
            const nextExpanded = !expanded;
            setExpanded(nextExpanded);
            if (nextExpanded) {
              setArticles(await fetchArticles(aimId));
            }
          }}
          overrideStyles={iconButtonStyles}
        >
          <span css={iconStyles}>
            {expanded ? minusRectIcon : plusRectIcon}
          </span>
          <span css={titleStyles}>Articles ({articlesCount})</span>
        </Button>
        <span css={separatorStyles}>•</span>
        <Button
          id={`articles-list-edit-${aimId}`}
          linkStyle
          onClick={noop} // TODO: Add edit action
          overrideStyles={iconButtonStyles}
        >
          Edit
        </Button>
      </div>
      {expanded && articles?.length > 0 && (
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
