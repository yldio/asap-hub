import { ResearchOutputDocumentType } from '@asap-hub/model';
import { SearchAndFilter } from '../organisms';
import { Option, Title } from '../organisms/CheckboxGroup';

export type ResearchOutputsSearchProps = {
  onChangeSearch: (newSearchQuery: string) => void;
  searchQuery: string;
  onChangeFilter: (filter: string) => void;
  filters: Set<string>;
};

export const researchOutputFilters: ReadonlyArray<
  Option<ResearchOutputDocumentType> | Title
> = [
  { title: 'TYPE OF OUTPUTS' },
  { label: 'Article', value: 'Article' },
  { label: 'Bioinformatics', value: 'Bioinformatics' },
  { label: 'Dataset', value: 'Dataset' },
  { label: 'Grant Document', value: 'Grant Document' },
  { label: 'Lab Resource', value: 'Lab Resource' },
  { label: 'Presentation', value: 'Presentation' },
  { label: 'Protocol', value: 'Protocol' },
];

const ResearchOutputsSearch: React.FC<ResearchOutputsSearchProps> = ({
  onChangeSearch,
  searchQuery,
  onChangeFilter,
  filters,
}) => (
  <SearchAndFilter
    searchPlaceholder="Enter a keyword, method, resource…"
    onChangeSearch={onChangeSearch}
    searchQuery={searchQuery}
    filterOptions={researchOutputFilters}
    onChangeFilter={onChangeFilter}
    filters={filters}
  />
);

export default ResearchOutputsSearch;
