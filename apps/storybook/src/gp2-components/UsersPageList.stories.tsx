import { Layout, UsersPageList } from '@asap-hub/gp2-components';
import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs';
import { ComponentProps } from 'react';
import { NoPaddingDecorator } from '../layout';

export default {
  title: 'GP2 / Templates / Users Directory / Users Page List',
  component: UsersPageList,
  decorators: [NoPaddingDecorator],
};

const layoutProps: Omit<ComponentProps<typeof Layout>, 'children'> = {
  projects: [],
  userId: '1',
  workingGroups: [],
  menuShown: false,
};
export const Normal = () => (
  <Layout {...layoutProps}>
    <UsersPageList
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
    </UsersPageList>
  </Layout>
);
