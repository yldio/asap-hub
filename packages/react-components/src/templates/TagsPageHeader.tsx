import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { CRNTagSearchEntities } from '@asap-hub/algolia';

import { Display, MultiSelect, Paragraph } from '../atoms';
import { rem } from '../pixels';
import { paper, steel } from '../colors';
import {
  contentSidePaddingWithNavigation,
  defaultContentTopPadding,
} from '../layout';
import { Filter } from '../organisms';
import { searchIcon } from '../icons';
import { noop } from '../utils';

const visualHeaderStyles = css({
  padding: `${rem(36)} ${contentSidePaddingWithNavigation(8)}`,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});
const textStyles = css({
  maxWidth: rem(610),
});

const controlsStyles = css({
  padding: `${defaultContentTopPadding} ${contentSidePaddingWithNavigation(
    8,
  )} 0`,
});

const styles = css({
  display: 'grid',
  gridTemplateColumns: 'auto min-content',
  gridColumnGap: rem(18),
  alignItems: 'center',
  justifySelf: 'center',
  width: '100%',
});

type TagsPageHeaderProps = {
  tags: string[];
  loadTags?: ComponentProps<typeof MultiSelect>['loadOptions'];
  setTags: (tags: string[]) => void;
} & Pick<
  ComponentProps<typeof Filter<CRNTagSearchEntities>>,
  'filters' | 'onChangeFilter' | 'filterOptions'
>;

const TagsPageHeader: React.FC<TagsPageHeaderProps> = ({
  tags,
  setTags,
  filters,
  filterOptions,
  onChangeFilter,
  loadTags = noop,
}) => (
  <header>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>Tags Search</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Search for all CRN Hub areas that include selected tags (research
          outputs, events, people, teams, tutorials, interest groups, working
          groups and news).
        </Paragraph>
      </div>
    </div>
    <div css={controlsStyles}>
      <div role="search" css={styles}>
        <MultiSelect
          leftIndicator={searchIcon}
          noOptionsMessage={() => 'No results found'}
          loadOptions={loadTags}
          onChange={(items) => setTags(items.map(({ value }) => value))}
          values={tags.map((tag) => ({
            label: tag,
            value: tag,
          }))}
          key={`${tags.join('')},${
            filters ? Array.from(filters) : [].join('')
          }`} // Force re-render to refresh default options. (https://github.com/JedWatson/react-select/discussions/5389)
          placeholder="Search for any tags..."
        />
        <div css={{ marginTop: rem(15) }}>
          <Filter
            filters={filters}
            onChangeFilter={onChangeFilter}
            filterOptions={filterOptions}
          />
        </div>
      </div>
    </div>
  </header>
);

export default TagsPageHeader;
