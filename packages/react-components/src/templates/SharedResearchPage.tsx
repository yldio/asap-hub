import { ComponentProps } from 'react';

import SharedResearchPageHeader from './SharedResearchPageHeader';
import PageContraints from './PageConstraints';

type SharedResearchPageProps = ComponentProps<typeof SharedResearchPageHeader>;
const SharedResearchPage: React.FC<SharedResearchPageProps> = ({
  onChangeSearch,
  searchQuery,
  children,
  onChangeFilter,
  filters,
}) => (
  <article>
    <SharedResearchPageHeader
      onChangeSearch={onChangeSearch}
      searchQuery={searchQuery}
      onChangeFilter={onChangeFilter}
      filters={filters}
    />
    <PageContraints as="main">{children}</PageContraints>
  </article>
);

export default SharedResearchPage;
