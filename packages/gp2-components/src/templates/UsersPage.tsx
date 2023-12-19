import { layoutContentStyles } from '../layout';
import { UsersHeader } from '../organisms';

const UsersPage: React.FC = ({ children }) => (
  <article css={layoutContentStyles}>
    <UsersHeader />
    <main>{children}</main>
  </article>
);

export default UsersPage;
