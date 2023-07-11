import { FC } from 'react';
import { DiscoverGuides } from '@asap-hub/react-components';
import { useGuidesByCollection } from '../guides/state';

const Guides: FC<Record<string, never>> = () => {
  const guides = useGuidesByCollection('Discover');
  return <DiscoverGuides guides={guides ? guides.items : []} />;
};
export default Guides;
