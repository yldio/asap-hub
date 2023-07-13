import { projectsImage } from '../images';
import { mainStyles } from '../layout';
import { PageBanner } from '../organisms';

const headerProps = {
  image: projectsImage,
  position: 'center',
  title: 'News',
  description: `Stay up to date with all the latest activity from the GP2 Hub. You'll be able to access newsletters and updates.`,
};

const NewsListPage: React.FC = ({ children }) => (
  <article>
    <PageBanner {...headerProps} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default NewsListPage;
