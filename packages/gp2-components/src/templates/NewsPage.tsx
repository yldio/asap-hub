import { projectsImage } from '../images';
import { layoutContentStyles, mainStyles } from '../layout';
import { PageBanner } from '../organisms';

const headerProps = {
  image: projectsImage,
  position: 'center',
  title: 'News',
  description: `Stay up to date with all the latest activity from the GP2 Hub. You'll be able to access newsletters and updates.`,
};

const NewsPage: React.FC<React.PropsWithChildren> = ({ children }) => (
  <article css={layoutContentStyles}>
    <PageBanner {...headerProps} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default NewsPage;
