import { gp2 as gp2Model } from '@asap-hub/model';
import { SearchAndFilter } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

type OutputPageListProps = Pick<
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

const outputFilters: ReadonlyArray<
  Option<gp2Model.OutputDocumentType> | Title
> = [
  { title: 'TYPE OF OUTPUT' },
  ...gp2Model.outputDocumentTypes.map((value) => ({ label: value, value })),
];

const OutputPageList: React.FC<OutputPageListProps> = ({
  children,
  filters,
  onChangeFilter,
  onChangeSearch,
  searchQuery,
}) => (
  <>
    <SearchAndFilter
      onChangeSearch={onChangeSearch}
      searchPlaceholder="Enter name or keyword..."
      searchQuery={searchQuery}
      onChangeFilter={onChangeFilter}
      filterOptions={outputFilters}
      filters={filters}
    />
    <main>{children}</main>
  </>
);

export default OutputPageList;
