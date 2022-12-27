import { gp2 } from '@asap-hub/model';
import { PageControls, pixels, Subtitle } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import UserCard from './UserCard';

const { rem } = pixels;
type UsersPageBodyProps = {
  users: gp2.ListUserResponse;
} & ComponentProps<typeof PageControls>;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(24),
  marginTop: rem(24),
});

const UsersPageBody: React.FC<UsersPageBodyProps> = ({
  users,
  ...pageProps
}) => {
  const firstItem = !users.total
    ? 0
    : pageProps.currentPageIndex + 1 === pageProps.numberOfPages
    ? users.total - users.items.length + 1
    : pageProps.currentPageIndex * users.items.length + 1;
  const lastItem =
    pageProps.currentPageIndex + 1 === pageProps.numberOfPages
      ? users.total
      : (pageProps.currentPageIndex + 1) * users.items.length;
  return (
    <>
      <Subtitle styleAsHeading={6} bold>
        Showing {firstItem}-{lastItem} of {users.total} results
      </Subtitle>
      <article css={containerStyles}>
        {users.items.map((user) => (
          <UserCard key={user.id} {...user} />
        ))}
        <section>
          <PageControls {...pageProps} />
        </section>
      </article>
    </>
  );
};

export default UsersPageBody;
