import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { NewsFrequency, newsFrequency } from '@asap-hub/model';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { SearchAndFilter } from '../organisms';
import { Option } from '../organisms/CheckboxGroup';

const containerStyles = css({
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
  marginBottom: '2px',
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
});

const textStyles = css({
  maxWidth: `${610 / perRem}em`,
});
const controlsStyles = css({
  padding: `${30 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
});

const newsFilters = [
  { label: 'TYPE OF OUTPUTS' },
  ...newsFrequency.map(
    (frequency): Option<NewsFrequency> => ({
      label: frequency,
      value: frequency,
    }),
  ),
];

type NewsPageHeaderProps = Pick<
  ComponentProps<typeof SearchAndFilter>,
  'filters' | 'onChangeFilter' | 'onChangeSearch' | 'searchQuery'
>;

const NewsPageHeader: React.FC<NewsPageHeaderProps> = ({
  filters,
  onChangeFilter,
  onChangeSearch,
  searchQuery,
}) => (
  <header>
    <div css={containerStyles}>
      <Display styleAsHeading={2}>News</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Stay up to date with all the latest activity from the CRN. You'll be
          able to access news and newsletters
        </Paragraph>
      </div>
    </div>
    <div css={controlsStyles}>
      <SearchAndFilter
        onChangeSearch={onChangeSearch}
        searchPlaceholder="Enter news title, keyword, ..."
        searchQuery={searchQuery}
        onChangeFilter={onChangeFilter}
        filterOptions={newsFilters}
        filters={filters}
      />
    </div>
  </header>
);

export default NewsPageHeader;
