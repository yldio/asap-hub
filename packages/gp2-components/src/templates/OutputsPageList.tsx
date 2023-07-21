import {
  pixels,
  SearchAndFilter,
  OptionType,
} from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';

const { rem } = pixels;

type OutputsPageListProps = Pick<
  ComponentProps<typeof SearchAndFilter>,
  'filters' | 'onChangeFilter' | 'onChangeSearch' | 'searchQuery'
>;
const containerStyles = css({
  marginTop: rem(48),
});

const outputsFilters = [
  { title: 'TYPE OF OUTPUTS' },
  ...gp2.outputDocumentTypes.map(
    (type): OptionType<gp2.OutputDocumentType> => ({
      label: type,
      value: type,
    }),
  ),
];

const OutputsPageList: React.FC<OutputsPageListProps> = ({
  children,
  onChangeSearch,
  onChangeFilter,
  searchQuery,
  filters,
}) => (
  <>
    <div css={containerStyles}>
      <SearchAndFilter
        searchQuery={searchQuery}
        filters={filters}
        filterOptions={outputsFilters}
        onChangeFilter={onChangeFilter}
        onChangeSearch={onChangeSearch}
        searchPlaceholder="Enter name..."
      />
    </div>

    <main>{children}</main>
  </>
);

export default OutputsPageList;
