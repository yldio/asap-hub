import { UsersHeader } from '../organisms';

const UsersPage: React.FC = ({ children }) => (
  <article>
    <UsersHeader />
    <main>{children}</main>
  </article>
);

export default UsersPage;
