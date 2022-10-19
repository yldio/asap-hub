import { PageBanner, projectsImage } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Organisms / Page Banner',
  component: PageBanner,
};

const props = {
  image: projectsImage,
  position: 'center',
  title: 'Title',
  description: 'Description',
};
export const Normal = () => <PageBanner {...props} />;
