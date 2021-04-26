import React from 'react';
import { Modal, Paragraph } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Modal',
  component: Modal,
};

export const Normal = () => (
  <Modal>
    <Paragraph>Content</Paragraph>
  </Modal>
);
export const NoPadding = () => (
  <Modal padding={false}>
    <Paragraph>Content</Paragraph>
  </Modal>
);
