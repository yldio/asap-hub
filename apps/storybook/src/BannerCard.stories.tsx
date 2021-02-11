import React from 'react';
import { BannerCard } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Banner Card',
  component: BannerCard,
};

export const Success = () => <BannerCard type="success">Content</BannerCard>;
export const Warning = () => <BannerCard type="warning">Content</BannerCard>;
