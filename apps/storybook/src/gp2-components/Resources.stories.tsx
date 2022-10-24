import { Resources } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';

export default {
  title: 'GP2 / Organisms / Resources',
};

const getResources = (length = 1): gp2.Resource[] =>
  Array.from({ length }, (_, itemIndex) => ({
    type: 'Link' as const,
    title: `resource title ${itemIndex}`,
    description: 'resource description',
    externalLink: 'http://a-link-some-where',
  }));
const resources = getResources(5);

const props = {
  headline: `Please note, this is a private space for this working group on the
        network. Nobody outside of this working group can see anything that you
        upload here.`,

  hint: 'View and share resources that others may find helpful.',
  resources,
};
export const Normal = () => <Resources {...props} />;
