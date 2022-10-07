import { gp2 } from '@asap-hub/model';
import {
  Button,
  filterIcon,
  Link,
  PageControls,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import UserCard from './UserCard';

const { rem } = pixels;
type UsersPageBodyProps = {
  users: gp2.ListUserResponse;
  filtersHref: string;
} & ComponentProps<typeof PageControls>;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(24),
  marginTop: rem(48),
});

const UsersPageBody: React.FC<UsersPageBodyProps> = ({
  users,
  onFiltersClick,
  ...pageProps
}) => (
  <article css={containerStyles}>
    <Button onClick={() => onFiltersClick()}>
      {filterIcon}
      Filters
    </Button>
    {users.items.map((user) => (
      <UserCard key={user.id} {...user} />
    ))}
    <section>
      <PageControls {...pageProps} />
    </section>
  </article>
);

export default UsersPageBody;
