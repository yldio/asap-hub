import { ReactNode } from 'react';
import { workingGroupsImage } from '../images';
import { layoutContentStyles, mainStyles } from '../layout';
import { PageBanner } from '../organisms';

const bannerProps = {
  image: workingGroupsImage,
  position: 'center',
  title: 'Tags Search',
  description:
    'Search for all GP2 Hub areas that include selected tags (outputs, events, people, working groups and projects).',
};

const TagSearchPage: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div css={layoutContentStyles}>
    <PageBanner {...bannerProps}></PageBanner>
    <main css={mainStyles}>{children}</main>
  </div>
);
export default TagSearchPage;
