import { gp2 as gp2Model } from '@asap-hub/model';
import {
  noop,
  SearchAndFilter,
  MultiSelect,
  searchIcon,
  Filter,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';

export type TagSearchPageListProps = {
  tags?: string[];
  setTags?: (tags: string[]) => void;
  loadTags?: ComponentProps<typeof MultiSelect>['loadOptions'];
} & Pick<
  ComponentProps<typeof SearchAndFilter>,
  'filters' | 'onChangeFilter' | 'onChangeSearch' | 'searchQuery'
>;

interface Option<V extends string> {
  value: V;
  label: string;
  enabled?: boolean;
}
interface Title {
  title: string;
  label?: undefined;
}

const outputFilters: ReadonlyArray<Option<gp2Model.EntityType> | Title> = [
  { title: 'AREAS' },
  { value: 'output', label: 'Outputs' },
  { value: 'event', label: 'Events' },
  { value: 'user', label: 'People' },
  { value: 'project', label: 'Projects' },
  { value: 'news', label: 'News' },
  { value: 'working-group', label: 'Groups' },
];

const styles = css({
  display: 'grid',
  gridTemplateColumns: 'auto min-content',
  gridColumnGap: `${18 / pixels.perRem}em`,
  alignItems: 'end',
});

const TagSearchPageList: React.FC<TagSearchPageListProps> = ({
  children,
  filters,
  onChangeFilter,
  onChangeSearch,
  searchQuery,
  tags = [],
  loadTags = noop,
  setTags = noop,
}) => (
  <>
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
        key={tags.join(',')} // Force re-render to refresh default options. (https://github.com/JedWatson/react-select/discussions/5389)
        placeholder="Search for any tags..."
      />
      <Filter
        filters={filters}
        onChangeFilter={onChangeFilter}
        filterOptions={outputFilters}
      />
    </div>
    <main>{children}</main>
  </>
);

export default TagSearchPageList;
