import { ResearchOutputDocumentType } from '@asap-hub/model';
import { SearchAndFilter } from '../organisms';
import { Option } from '../organisms/CheckboxGroup';

export type ResearchOutputsSearchProps = {
  onChangeSearch: (newSearchQuery: string) => void;
  searchQuery: string;
  onChangeFilter: (filter: string) => void;
  filters: Set<string>;
};

export const researchOutputFilters: Option<ResearchOutputDocumentType>[] = [
  { label: 'Grant Document', value: 'Grant Document' },
  { label: 'Presentation', value: 'Presentation' },
  { label: 'Protocol', value: 'Protocol' },
  { label: 'Dataset', value: 'Dataset' },
  { label: 'Bioinformatics', value: 'Bioinformatics' },
  { label: 'Lab Resource', value: 'Lab Resource' },
  { label: 'Article', value: 'Article' },
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
    filterTitle="TYPE OF OUTPUTS"
    onChangeFilter={onChangeFilter}
    filters={filters}
  />
);

export default ResearchOutputsSearch;
