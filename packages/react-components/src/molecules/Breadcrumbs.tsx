import { css } from '@emotion/react';

import { Link } from '../atoms';
import { lead } from '../colors';
import { homeIcon } from '../icons';
import { rem } from '../pixels';

const listStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  fontSize: rem(14),
  lineHeight: rem(24),
  columnGap: rem(8),
  rowGap: rem(4),
});

const itemStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
});

const homeStyles = css({
  a: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  svg: {
    display: 'block',
    width: rem(24),
    height: rem(24),
  },
});

const separatorStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  svg: {
    display: 'block',
  },
});

const separatorIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={6}
    height={7}
    viewBox="0 0 6 7"
    fill="none"
  >
    <path
      d="M4.86133 3.19922L0.000976562 1.30566V0L5.83887 2.58398V3.38379L4.86133 3.19922ZM0.000976562 4.86719L4.875 2.93262L5.83887 2.78906V3.58203L0.000976562 6.17285V4.86719Z"
      fill="#4D646B"
    />
  </svg>
);

const plainItemStyles = css({
  color: lead.rgb,
});

export type BreadcrumbItem = {
  readonly label: string;
  readonly href?: string;
};

type BreadcrumbsProps = {
  readonly homeHref: string;
  readonly items?: ReadonlyArray<BreadcrumbItem>;
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ homeHref, items = [] }) => (
  <nav aria-label="breadcrumbs">
    <ol css={listStyles}>
      <li css={[itemStyles, homeStyles]}>
        <Link href={homeHref} label="Home">
          {homeIcon}
        </Link>
      </li>
      {items.map(({ label, href }, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={`${index}-${label}`} css={itemStyles}>
            <span css={separatorStyles} aria-hidden="true">
              {separatorIcon}
            </span>
            {isLast || !href ? (
              <span
                css={plainItemStyles}
                aria-current={isLast ? 'page' : undefined}
              >
                {label}
              </span>
            ) : (
              <Link href={href}>{label}</Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
