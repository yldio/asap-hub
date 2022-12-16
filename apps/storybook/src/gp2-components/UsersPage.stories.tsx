import { Layout, UsersPage } from '@asap-hub/gp2-components';
import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs';
import { NoPaddingDecorator } from '../layout';

export default {
  title: 'GP2 / Templates / Users Directory / Users Page',
  component: UsersPage,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <Layout>
    <UsersPage
      onSearchQueryChange={() => action('search')}
      searchQuery={text('Search Query', '')}
      isAdministrator={
        (select<boolean>, 'Is Administrator', { Yes: true, No: false }, false)
      }
      onFiltersClick={() => action('filters')}
      onExportClick={() => action('export')}
      changeLocation={() => action('location')}
      updateFilters={() => action('update filters')}
      filters={{}}
      projects={[]}
      workingGroups={[]}
      displayFilters={
        (select<boolean>, 'Display Filters', { Yes: true, No: false }, false)
      }
    >
      Page content
    </UsersPage>
  </Layout>
);
