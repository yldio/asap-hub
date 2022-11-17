import { gp2 } from '@asap-hub/model';
import { PageControls, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import FilterSearchExport from './FilterSearchExport';
import UserCard from './UserCard';

const { rem } = pixels;
type UsersPageBodyProps = {
  users: gp2.ListUserResponse;
} & ComponentProps<typeof PageControls> &
  ComponentProps<typeof FilterSearchExport>;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(24),
  marginTop: rem(48),
});

const UsersPageBody: React.FC<UsersPageBodyProps> = ({
  users,
  onFiltersClick,
  onExportClick,
  isAdministrator,
  searchQuery,
  onSearchQueryChange,
  ...pageProps
}) => (
  <article css={containerStyles}>
    <FilterSearchExport
      searchQuery={searchQuery}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSearchQueryChange={onSearchQueryChange}
      onFiltersClick={onFiltersClick}
      onExportClick={onExportClick}
      isAdministrator={isAdministrator}
    />
    {users.items.map((user) => (
      <UserCard key={user.id} {...user} />
    ))}
    <section>
      <PageControls {...pageProps} />
    </section>
  </article>
);

export default UsersPageBody;
